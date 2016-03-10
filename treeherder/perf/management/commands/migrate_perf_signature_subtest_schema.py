import copy
import time
from optparse import make_option

from django.core.management.base import BaseCommand

from treeherder.etl.perf import _get_signature_hash
from treeherder.model.models import (Datasource,
                                     Repository)
from treeherder.perf.models import (PerformanceAlert,
                                    PerformanceDatum,
                                    PerformanceSignature)


class Command(BaseCommand):
    help = "migrate legacy signature data to new schema, which encodes subtests"
    option_list = BaseCommand.option_list + (
        make_option('--project',
                    action='append',
                    dest='project',
                    help='Filter deletion to particular project(s)',
                    type='string'),
        make_option('--interval',
                    dest='interval',
                    help='Wait specified interval between signature migrations',
                    type='float',
                    default=0.0),
        make_option('--delete',
                    dest='delete',
                    help='Delete old signatures once done',
                    action='store_true',
                    default=False)

    )

    def _reassign_signature(self, old_signature, new_signature, sleep_interval,
                            delete_old):
        start_time = time.time()
        datums = PerformanceDatum.objects.filter(
            signature=old_signature)
        alerts = PerformanceAlert.objects.filter(
            series_signature=old_signature)
        datums.update(signature=new_signature)
        alerts.update(series_signature=new_signature)
        if delete_old:
            old_signature.delete()
        print "- {}: {} [{}]".format(old_signature.signature_hash,
                                     new_signature.signature_hash,
                                     time.time() - start_time)
        time.sleep(sleep_interval)

    def handle(self, *args, **options):
        if options['project']:
            projects = options['project']
        else:
            projects = Datasource.objects.values_list('project', flat=True)

        for project in projects:
            try:
                repository = Repository.objects.get(name=project)
            except:
                continue
            signatures = PerformanceSignature.objects.filter(
                    repository=repository
            )
            for signature in signatures:
                if (signature.extra_properties.get('subtest_signatures') and
                    len(signature.extra_properties.get('subtest_signatures')) > 0):
                    # old-style signature which needs migration (along with its
                    # subtests)
                    subtest_signature_hashes = signature.extra_properties['subtest_signatures']
                    subtest_signatures = PerformanceSignature.objects.filter(
                        repository=signature.repository,
                        framework=signature.framework,
                        signature_hash__in=subtest_signature_hashes)
                    revised_extra_properties = copy.deepcopy(signature.extra_properties)
                    revised_extra_properties.pop('subtest_signatures')
                    reference_data = {
                        'option_collection_hash': signature.option_collection.option_collection_hash,
                        'machine_platform': signature.platform.platform
                    }
                    subtest_properties = []
                    for subtest_signature in subtest_signatures:
                        subtest_metadata = {
                            'suite': subtest_signature.suite,
                            'test': subtest_signature.test,
                            'lowerIsBetter': subtest_signature.lower_is_better
                        }
                        subtest_metadata.update(reference_data)
                        subtest_properties.append(subtest_metadata)
                    subtest_properties.sort(key=lambda s: s['test'])

                    summary_properties = {
                        'suite': signature.suite,
                        'subtest_properties': subtest_properties
                    }
                    summary_properties.update(reference_data)
                    summary_properties.update(revised_extra_properties)
                    summary_hash = _get_signature_hash(summary_properties)
                    updated_signature = PerformanceSignature.objects.filter(
                        repository=signature.repository,
                        signature_hash=summary_hash)
                    if updated_signature:
                        assert len(updated_signature) == 1
                        print updated_signature[0]
                        for subtest_signature in subtest_signatures:
                            updated_subtest_signatures = PerformanceSignature.objects.filter(
                                parent_signature=updated_signature[0])
                            for updated_subtest_signature in updated_subtest_signatures:
                                if updated_subtest_signature.test == subtest_signature.test:
                                    self._reassign_signature(subtest_signature,
                                                             updated_subtest_signature,
                                                             options['interval'],
                                                             options['delete'])
                        self._reassign_signature(signature,
                                                 updated_signature[0],
                                                 options['interval'], options['delete'])
