
import { memo, useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'

import { usePopup } from 'contexts/popup-context'
import { useS3fVaultContracts } from 'contexts/s3f-vault-context'
import GradientButton from 'components/UI/Buttons/GradientButton'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import AdvancedTransactionOption from 'parts/AdvancedTransactionOption'
import CurrencyItem from 'parts/Vault/CurrencyItem'
import WithdrawPercentage from 'parts/Vault/WithdrawPercentage'
import WithdrawTokenRadio from 'parts/Vault/WithdrawTokenRadio'
import VaultRemoveLiquidityDialog from 'parts/Vault/VaultRemoveLiquidityDialog'
import { useFormStyles } from 'styles/use-styles'

const TOKENS = [
  { label: 'All', value: -1 },
  { label: 'FRAX', value: 0 },
  { label: 'TUSD', value: 1 },
  { label: 'USDT', value: 2 }
]

const RemoveLiquidity = () => {
  const classes = useFormStyles()
  const { setPopUp } = usePopup()
  const { fraxToken, tusdToken, usdtToken, getWithdrawAmount, removeLiquidity } = useS3fVaultContracts()

  const [withdrawPercentage, setWithdrawPercentage] = useState(0)
  const [selectedToken, setSelectedToken] = useState(-1)
  const [maxSlippage, setMaxSlippage] = useState(0.1)
  const [liquidityDialog, setLiquidityDialog] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState([0, 0, 0])
  const [liquidityData, setLiquidityData] = useState([0, 0, 0])

  useEffect(() => {
    const load = async () => {
      const withdrawAmount = await getWithdrawAmount(withdrawPercentage, selectedToken)
      setWithdrawAmount(withdrawAmount)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withdrawPercentage, selectedToken])

  const onSubmit = async () => {
    if (!withdrawAmount[0] && !withdrawAmount[1] && !withdrawAmount[2]) {
      setPopUp({
        title: 'Input Error',
        text: `Please enter at least one input`
      })
      return;
    }

    const liquidityData = [
      {
        token: fraxToken,
        value: withdrawAmount[0]
      },
      {
        token: tusdToken,
        value: withdrawAmount[1]
      },
      {
        token: usdtToken,
        value: withdrawAmount[2]
      }
    ]

    setLiquidityData(liquidityData)
    setLiquidityDialog(true)
  }

  const removeLiquidityHandler = async () => {
    setLiquidityDialog(false)
    await removeLiquidity(liquidityData, withdrawPercentage, maxSlippage, selectedToken)
    setWithdrawPercentage(0)
    setSelectedToken(-1)
  }

  return (
    <CardFormWrapper title='Remove liquidity'>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <WithdrawPercentage
            value={withdrawPercentage}
            setValue={setWithdrawPercentage}
          />
        </Grid>
        <Grid item xs={12}>
          <WithdrawTokenRadio
            tokens={TOKENS}
            value={selectedToken}
            setValue={setSelectedToken}
          />
        </Grid>
        <Grid item xs={12}>
          <CurrencyItem
            token={fraxToken}
            value={withdrawAmount[0] || 0}
          />
        </Grid>
        <Grid item xs={12}>
          <CurrencyItem
            token={tusdToken}
            value={withdrawAmount[1] || 0}
          />
        </Grid>
        <Grid item xs={12}>
          <CurrencyItem
            token={usdtToken}
            value={withdrawAmount[2] || 0}
          />
        </Grid>
        <Grid item xs={12}>
          <AdvancedTransactionOption
            value={maxSlippage}
            setValue={setMaxSlippage}
          />
        </Grid>
        <Grid item xs={12}>
          <GradientButton
            fullWidth
            color='secondary'
            className={classes.button}
            onClick={onSubmit}
          >
            Remove liquidity
          </GradientButton>
        </Grid>
      </Grid>
      {liquidityDialog &&
        <VaultRemoveLiquidityDialog
          liquidityData={liquidityData}
          maxSlippage={maxSlippage}
          open={liquidityDialog}
          setOpen={setLiquidityDialog}
          onConfirm={removeLiquidityHandler}
        />
      }
    </CardFormWrapper>
  )
}

export default memo(RemoveLiquidity)