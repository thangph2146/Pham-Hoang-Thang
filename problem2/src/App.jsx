import { useState, useEffect } from 'react';
import axios from 'axios';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ArrowsRightLeftIcon, ChevronUpDownIcon, CheckIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { Listbox } from '@headlessui/react';

const queryClient = new QueryClient();

function TokenSelect({ value, onChange, tokens, className = '', disabled = false }) {
  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className="relative mt-1">
        <Listbox.Button className={`relative w-full cursor-pointer rounded-xl bg-white py-3 pl-4 pr-10 text-left border-2 border-gray-200 focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'} ${className}`}>
          {value ? (
            <div className="flex items-center">
              <img
                src={`/tokens/${value}.svg`}
                alt={value}
                className="w-7 h-7 mr-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/tokens/UNKNOWN.svg';
                }}
              />
              <span className="block truncate font-medium">{value}</span>
            </div>
          ) : (
            <span className="block truncate text-gray-400">Select token</span>
          )}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {tokens.map((token) => (
            <Listbox.Option
              key={token.currency}
              value={token.currency}
              className={({ active }) =>
                `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                  active ? 'bg-primary/10 text-primary' : 'text-gray-900'
                }`
              }
            >
              {({ selected }) => (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={`/tokens/${token.currency}.svg`}
                        alt={token.currency}
                        className="w-7 h-7 mr-2"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/tokens/UNKNOWN.svg';
                        }}
                      />
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {token.currency}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">${token.price.toFixed(2)}</span>
                  </div>
                  {selected && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
    </div>
  );
}

function CurrencySwapForm() {
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [swapAnimation, setSwapAnimation] = useState(false);

  const { data: prices, isLoading, isError } = useQuery({
    queryKey: ['prices'],
    queryFn: async () => {
      const response = await axios.get('https://interview.switcheo.com/prices.json');
      return response.data;
    },
  });

  const availableTokens = prices?.filter(price => price.price) || [];

  const calculateExchangeRate = () => {
    if (!fromCurrency || !toCurrency || !prices) return;
    
    const fromPrice = prices.find(p => p.currency === fromCurrency)?.price || 0;
    const toPrice = prices.find(p => p.currency === toCurrency)?.price || 0;
    
    if (fromPrice && toPrice) {
      setExchangeRate(toPrice / fromPrice);
    }
  };

  useEffect(() => {
    calculateExchangeRate();
  }, [fromCurrency, toCurrency, prices]);

  const handleSwap = () => {
    setSwapAnimation(true);
    setTimeout(() => {
      setFromCurrency(toCurrency);
      setToCurrency(fromCurrency);
      setSwapAnimation(false);
    }, 300);
  };

  const estimatedOutput = amount && exchangeRate ? (amount * exchangeRate).toFixed(6) : '';
  
  const fromTokenPrice = fromCurrency ? prices?.find(p => p.currency === fromCurrency)?.price : null;
  const toTokenPrice = toCurrency ? prices?.find(p => p.currency === toCurrency)?.price : null;

  if (isError) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-red-500 text-center font-medium">
          Failed to load token prices. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Currency Swap</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
          <div className="flex gap-3">
            <TokenSelect
              value={fromCurrency}
              onChange={setFromCurrency}
              tokens={availableTokens}
              className="w-1/2"
              disabled={isLoading}
            />
            <div className="relative w-1/2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="block w-full rounded-xl border-2 border-gray-200 py-3 px-4 focus:border-primary focus:ring-primary pr-20 text-lg font-medium"
                disabled={isLoading}
              />
              {fromTokenPrice && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                  ${(amount * fromTokenPrice).toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative flex justify-center py-2">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-b-2 border-gray-100"></div>
          <button
            onClick={handleSwap}
            disabled={isLoading}
            className={`relative z-10 p-3 rounded-xl hover:bg-gray-100 transition-all duration-300 bg-white border-2 border-gray-200 ${
              swapAnimation ? 'rotate-180' : ''
            }`}
          >
            <ArrowsRightLeftIcon className="h-5 w-5 text-gray-500" />
          </button>
          {exchangeRate && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-sm bg-white px-2">
              {exchangeRate > 1 ? (
                <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 inline" />
              ) : (
                <ArrowTrendingDownIcon className="h-5 w-5 text-red-500 inline" />
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
          <div className="flex gap-3">
            <TokenSelect
              value={toCurrency}
              onChange={setToCurrency}
              tokens={availableTokens}
              className="w-1/2"
              disabled={isLoading}
            />
            <div className="relative w-1/2">
              <input
                type="text"
                value={estimatedOutput}
                readOnly
                placeholder="0.00"
                className="block w-full rounded-xl border-2 border-gray-200 py-3 px-4 bg-gray-50 pr-20 text-lg font-medium"
              />
              {toTokenPrice && estimatedOutput && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                  ${(estimatedOutput * toTokenPrice).toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>

        {exchangeRate && (
          <div className="text-sm text-gray-600 mt-2 flex items-center justify-center space-x-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div className="flex items-center">
              <img
                src={`/tokens/${fromCurrency}.svg`}
                alt={fromCurrency}
                className="w-6 h-6 mr-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/tokens/UNKNOWN.svg';
                }}
              />
              <span className="font-medium">1 {fromCurrency}</span>
            </div>
            <span>=</span>
            <div className="flex items-center">
              <img
                src={`/tokens/${toCurrency}.svg`}
                alt={toCurrency}
                className="w-6 h-6 mr-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/tokens/UNKNOWN.svg';
                }}
              />
              <span className="font-medium">{exchangeRate.toFixed(6)} {toCurrency}</span>
            </div>
          </div>
        )}

        <button
          className="w-full bg-primary text-white py-4 px-6 rounded-xl hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-lg font-medium shadow-sm"
          disabled={!fromCurrency || !toCurrency || !amount || amount <= 0 || isLoading}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <span>Swap</span>
              {fromTokenPrice && toTokenPrice && (
                <span className="text-sm opacity-90 bg-white/20 py-1 px-3 rounded-lg">
                  ${(amount * fromTokenPrice).toFixed(2)} → ${(estimatedOutput * toTokenPrice).toFixed(2)}
                </span>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <CurrencySwapForm />
      </div>
    </QueryClientProvider>
  );
}

export default App;
