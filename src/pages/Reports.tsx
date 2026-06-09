import { ReportsHeader } from './reports/ReportsHeader'
import { ReportsFilters } from './reports/ReportsFilters'
import { ReportsOverview } from './reports/ReportsOverview'
import { TopAgentsChart } from './reports/charts/TopAgentsChart'
import { SquadSuccessChart } from './reports/charts/SquadSuccessChart'
import { TimeTrendChart } from './reports/charts/TimeTrendChart'
import { ReportsTable } from './reports/ReportsTable'
import { ReportsProvider } from '@/hooks/use-reports'

export default function Reports() {
  return (
    <ReportsProvider>
      <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 space-y-6 animate-fade-in pb-16">
        <ReportsHeader />
        <ReportsFilters />
        <ReportsOverview />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopAgentsChart />
          <SquadSuccessChart />
          <div className="lg:col-span-2">
            <TimeTrendChart />
          </div>
        </div>
        <ReportsTable />
      </div>
    </ReportsProvider>
  )
}
