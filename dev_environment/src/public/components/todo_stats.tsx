import React from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiStat,
  EuiTitle,
  EuiSpacer,
} from '@elastic/eui';
import { Chart, Settings, BarSeries, Partition, PartitionLayout, Axis } from '@elastic/charts';
import { TodoStats, TodoStatus } from '../../common';

interface TodoStatsProps {
  stats: TodoStats;
}

const customColors = {
  CRITICAL: '#bd271e',
  HIGH: '#f5a700',
  MEDIUM: '#54b399',
  LOW: '#98a2b3',
};

export const TodoStatsComponent: React.FC<TodoStatsProps> = ({ stats }) => {
  console.log(stats);
  const statusData = Object.entries(stats.byStatus).map(([key, value]) => ({
    status: key.replace(/_/g, ' ').toUpperCase(),
    count: value,
  }));

  const priorityData = Object.entries(stats.byPriority).map(([key, value]) => ({
    priority: key.toUpperCase(),
    count: value,
    color: customColors[key.toUpperCase() as keyof typeof customColors] || '#000',
  }));

  const formatCompletionTime = (milliseconds?: number): string => {
    if (!milliseconds) return 'N/A';
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h`;
  };

  return (
    <>
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiPanel>
            <EuiStat
              title={stats.total.toString()}
              description="Total Tasks"
              titleColor="primary"
              textAlign="center"
            />
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel>
            <EuiStat
              title={stats.byStatus[TodoStatus.COMPLETED]?.toString() || '0'}
              description="Completed"
              titleColor="success"
              textAlign="center"
            />
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel>
            <EuiStat
              title={stats.byStatus[TodoStatus.IN_PROGRESS]?.toString() || '0'}
              description="In Progress"
              titleColor="primary"
              textAlign="center"
            />
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel>
            <EuiStat
              title={`${stats.completionRate.toFixed(1)}%`}
              description="Completion Rate"
              titleColor="accent"
              textAlign="center"
            />
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel>
            <EuiStat
              title={formatCompletionTime(stats.avgCompletionTime)}
              description="Avg. Completion Time"
              titleColor="subdued"
              textAlign="center"
            />
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer />

      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiPanel>
            <EuiTitle size="xs">
              <h3>Tasks by Status</h3>
            </EuiTitle>
            <EuiSpacer size="m" />
            <div style={{ height: 300 }}>
              <Chart>
                <Settings showLegend legendPosition="right" />
                <Partition
                  id="status-partition"
                  data={statusData}
                  valueAccessor={(d: any) => d.count}
                  layers={[
                    {
                      groupByRollup: (d: any) => d.status,
                      shape: {
                        fillColor: (d: any) => {
                          const status = d?.dataName;
                          if (status?.includes('COMPLETED') && !status?.includes('ERROR'))
                            return '#6dccb1';
                          if (status?.includes('PROGRESS')) return '#006bb4';
                          if (status?.includes('ERROR')) return '#bd271e';
                          return '#98a2b3';
                        },
                      },
                    },
                  ]}
                  config={{
                    partitionLayout: PartitionLayout.sunburst,
                    emptySizeRatio: 0.4,
                  }}
                />
              </Chart>
            </div>
          </EuiPanel>
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiPanel>
            <EuiTitle size="xs">
              <h3>Tasks by Priority</h3>
            </EuiTitle>
            <EuiSpacer size="m" />
            <div style={{ height: 300 }}>
              <Chart>
                <Settings showLegend={false} />
                <BarSeries
                  id="priority-bar"
                  name="Tasks"
                  data={priorityData}
                  xAccessor="priority"
                  yAccessors={['count']}
                  styleAccessor={(d: any) => {
                    return d.datum?.color;
                  }}
                />
                <Axis id="bottom-axis" position="bottom" gridLine={{ visible: true }} />
                <Axis
                  id="left-axis"
                  position="left"
                  gridLine={{ visible: true }}                  
                />
              </Chart>
            </div>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};
