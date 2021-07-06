import { gql } from '@apollo/client';

const LAST_SNOWBALL_INFO = gql`
  query {
    LastSnowballInfo {
      poolsInfo {
        name
        address
        source
        tvlStaked
        dailyAPY
        weeklyAPY
        yearlyAPY
        performanceFees
        token0 {
          address
        }
        token1 {
          address
        }
        token2 {
          address
        }
        gaugeInfo {
          fullYearlyAPY
          snobDailyAPR
          snobWeeklyAPR
          snobYearlyAPR
          tvlStaked
          snobAllocation
        }
      }
    }
  }
`;

export { LAST_SNOWBALL_INFO };