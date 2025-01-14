import { useMemo } from 'react';
import { Box, BoxProps, Typography, Paper, Container, Grid, useTheme, Chip, LinearProgress } from '@mui/material';

interface WalletBalance {
  currency: string;
  amount: number;
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}

// Giả lập các hooks với dữ liệu mẫu
const useWalletBalances = () => {
  return [
    { currency: 'Bitcoin', amount: -0.1 },
    { currency: 'Ethereum', amount: -1.2 },
    { currency: 'Dogecoin', amount: -1000 },
    { currency: 'Solana', amount: 2.5 }, // Số dương sẽ bị filter
    { currency: 'USDT', amount: -500 }
  ] as WalletBalance[];
};

const usePrices = () => {
  return {
    Bitcoin: 45000,
    Ethereum: 3000,
    Dogecoin: 0.1,
    Solana: 100,
    USDT: 1
  } as Record<string, number>;
};

interface WalletRowProps {
  className?: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
  currency: string;
}

const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case 'Bitcoin':
      return 'BTC';
    case 'Ethereum':
      return 'ETH';
    case 'Dogecoin':
      return 'DOGE';
    case 'USDT':
      return 'USDT';
    default:
      return currency;
  }
};

const getCurrencyColor = (currency: string): string => {
  switch (currency) {
    case 'Bitcoin':
      return '#F7931A';
    case 'Ethereum':
      return '#627EEA';
    case 'Dogecoin':
      return '#C2A633';
    case 'USDT':
      return '#26A17B';
    default:
      return '#1976d2';
  }
};

const WalletRow = (props: WalletRowProps) => {
  const { amount, usdValue, formattedAmount, currency } = props;
  const theme = useTheme();
  const currencyColor = getCurrencyColor(currency);
  const symbol = getCurrencySymbol(currency);

  // Tính phần trăm cho progress bar (ví dụ: dựa trên số âm)
  const progressValue = Math.min(Math.abs(amount) * 10, 100);

  return (
    <Paper 
      elevation={3}
      sx={{ 
        p: 3,
        mb: 2,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${theme.palette.mode === 'dark' ? '#1A2027' : '#fff'} 0%, ${theme.palette.mode === 'dark' ? '#2A3037' : '#f8f9fa'} 100%)`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 20px rgba(${currencyColor.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(',')}, 0.15)`,
        },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={7}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                background: `linear-gradient(135deg, ${currencyColor} 0%, ${currencyColor}dd 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                boxShadow: `0 4px 12px ${currencyColor}40`
              }}
            >
              {symbol}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: currencyColor }}>
                  {currency}
                </Typography>
                <Chip 
                  label={symbol}
                  size="small"
                  sx={{ 
                    backgroundColor: `${currencyColor}20`,
                    color: currencyColor,
                    fontWeight: 'bold'
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Số dư: {formattedAmount} {symbol}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              ${Math.abs(usdValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
              <Chip 
                label={amount < 0 ? 'Nợ' : 'Dư'}
                size="small"
                color={amount < 0 ? 'error' : 'success'}
                sx={{ fontWeight: 'bold' }}
              />
              <Typography variant="caption" color="text.secondary">
                {symbol}/USD
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <LinearProgress 
            variant="determinate" 
            value={progressValue}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: `${currencyColor}20`,
              '& .MuiLinearProgress-bar': {
                backgroundColor: currencyColor,
              }
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        return balance.amount <= 0;
      })
      .sort((a: WalletBalance, b: WalletBalance) => {
        return b.amount - a.amount;
      });
  }, [balances]);

  const formattedBalances: FormattedWalletBalance[] = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => ({
      currency: balance.currency,
      amount: balance.amount,
      formatted: balance.amount.toFixed()
    }));
  }, [sortedBalances]);

  const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
        currency={balance.currency}
      />
    );
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 , mx: 'auto'}}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 800,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Ví Crypto của bạn
        </Typography>
        <Typography variant="body1" color="text.white" sx={{ mt: 1 }}>
          Quản lý tài sản crypto của bạn một cách thông minh
        </Typography>
      </Box>
      <Box {...rest}>{rows}</Box>
    </Container>
  );
}; 