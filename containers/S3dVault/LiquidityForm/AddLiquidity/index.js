
import { memo, useState } from 'react'
import { Grid } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'

import { usePopup } from 'contexts/popup-context'
import { useS3dVaultContracts } from 'contexts/s3d-vault-context'
import AddIcon from 'components/Icons/AddIcon'
import GradientButton from 'components/UI/Buttons/GradientButton'
import TokenTextField from 'components/UI/TextFields/TokenTextField'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import AdvancedTransactionOption from 'parts/AdvancedTransactionOption'
import VaultAddLiquidityDialog from 'parts/Vault/VaultAddLiquidityDialog'
import { useFormStyles } from 'styles/use-styles'

const AddLiquidity = () => {
  const classes = useFormStyles()
  const { setPopUp } = usePopup()
  const { usdtToken, busdToken, daiToken, getDepositReview, addLiquidity } = useS3dVaultContracts()

  const [maxSlippage, setMaxSlippage] = useState(0.1)
  const [liquidityData, setLiquidityData] = useState([])
  const [receivingValue, setReceivingValue] = useState({})
  const [discount, setDiscount] = useState(0)
  const [liquidityDialog, setLiquidityDialog] = useState(false);

  const { control, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    if (!data.firstInput && !data.secondInput && !data.thirdInput) {
      setPopUp({
        title: 'Input Error',
        text: `Please enter at least one input`
      })
      return;
    }

    const liquidityData = [
      {
        token: usdtToken,
        value: data.firstInput
      },
      {
        token: busdToken,
        value: data.secondInput
      },
      {
        token: daiToken,
        value: data.thirdInput
      }
    ]

    const { minToMintValue, discount } = await getDepositReview(liquidityData)
    const receivingValue = {
      token: 's3D',
      value: minToMintValue
    }

    setLiquidityData(liquidityData)
    setReceivingValue(receivingValue)
    setDiscount(discount)
    setLiquidityDialog(true)
  }

  const addLiquidityHandler = () => {
    setLiquidityDialog(false)
    addLiquidity(liquidityData, maxSlippage, receivingValue)
  }

  return (
    <CardFormWrapper title='Add liquidity'>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              as={<TokenTextField />}
              name='firstInput'
              label='Input:'
              token={usdtToken}
              balance={usdtToken.balance}
              control={control}
              defaultValue={0}
            />
            <div className={classes.iconContainer}>
              <AddIcon className={classes.icon} />
            </div>
          </Grid>
          <Grid item xs={12}>
            <Controller
              as={<TokenTextField />}
              name='secondInput'
              label='Input:'
              token={busdToken}
              balance={busdToken.balance}
              control={control}
              defaultValue={0}
            />
            <div className={classes.iconContainer}>
              <AddIcon className={classes.icon} />
            </div>
          </Grid>
          <Grid item xs={12}>
            <Controller
              as={<TokenTextField />}
              name='thirdInput'
              label='Input:'
              token={daiToken}
              balance={daiToken.balance}
              control={control}
              defaultValue={0}
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
              type='submit'
              className={classes.button}
            >
              Add liquidity
            </GradientButton>
          </Grid>
        </Grid>
      </form>
      {liquidityDialog &&
        <VaultAddLiquidityDialog
          discount={discount}
          liquidityData={liquidityData}
          receivingValue={receivingValue}
          maxSlippage={maxSlippage}
          open={liquidityDialog}
          setOpen={setLiquidityDialog}
          onConfirm={addLiquidityHandler}
        />
      }
    </CardFormWrapper>
  )
}

export default memo(AddLiquidity)