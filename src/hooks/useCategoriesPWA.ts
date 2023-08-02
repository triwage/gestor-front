import { useMemo } from 'react'

import { ListCashback } from '../services/pwa/cashback'
import {
  ListDefaultOperationsCategories,
  ListPWACategoriesOfProviders,
} from '../services/pwa/categories'
import { ListProvidersPWA } from '../services/pwa/providers'
import { ListRVCategories } from '../services/rv/categories'

import { useQueries } from '@tanstack/react-query'

export function useCategoriesPWA(idCategory: number) {
  const [
    CashbackPWA,
    ProvidersPWA,
    CategoriesOfProviders,
    CategoriesRV,
    DefaultOperationsCategories,
  ] = useQueries({
    queries: [
      { queryKey: ['PWACashback'], queryFn: ListCashback },
      { queryKey: ['PWAProviders'], queryFn: ListProvidersPWA },
      {
        queryKey: ['PWACategiesOfProviders', idCategory],
        queryFn: () => ListPWACategoriesOfProviders(idCategory),
        cacheTime: Infinity,
      },
      {
        queryKey: ['RVCategories'],
        queryFn: ListRVCategories,
      },
      {
        queryKey: ['PWADefaultOperationsCategories'],
        queryFn: ListDefaultOperationsCategories,
      },
    ],
  })

  const optionsProviders = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>

    if (ProvidersPWA.data) {
      res = ProvidersPWA.data?.map((item) => {
        return {
          value: item.fopw_id,
          label: item.fopw_nome,
        }
      })
    }
    return res
  }, [ProvidersPWA.data])

  const optionsCategoriesRV = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>

    if (CategoriesRV.data) {
      res = CategoriesRV.data?.map((item) => {
        return {
          value: item.pcrv_id,
          label: item.pcrv_kind,
        }
      })
    }
    return res
  }, [CategoriesRV.data])

  const optionsCashback = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>
    if (CashbackPWA.data) {
      res = CashbackPWA.data?.map((item) => {
        return {
          value: item.cash_id,
          label: item.cash_descricao,
        }
      })
    }
    return res
  }, [CashbackPWA.data])

  const optionsDefaultOperationsCategories = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>
    if (DefaultOperationsCategories.data) {
      res = DefaultOperationsCategories.data?.debito?.map((item, index) => {
        return {
          value: index,
          label: item,
        }
      })
    }
    return res
  }, [DefaultOperationsCategories.data])

  function Loading() {
    if (
      ProvidersPWA.isLoading ||
      ProvidersPWA.isFetching ||
      CashbackPWA.isLoading ||
      CashbackPWA.isFetching ||
      CategoriesOfProviders.isLoading ||
      CategoriesOfProviders.isFetching ||
      CategoriesRV.isLoading ||
      CategoriesRV.isFetching
    ) {
      return true
    } else {
      return false
    }
  }

  return {
    CashbackPWA: CashbackPWA.data,
    ProvidersPWA: ProvidersPWA.data,
    CategoriesOfProviders: CategoriesOfProviders.data,
    CategoriesRV: CategoriesRV.data,
    DefaultOperationsCategories: DefaultOperationsCategories.data,
    optionsCashback,
    optionsProviders,
    optionsCategoriesRV,
    optionsDefaultOperationsCategories,
    loading: Loading,
    refetch: ProvidersPWA.refetch,
    isFetchedAfterMount: CategoriesOfProviders.isFetchedAfterMount,
  }
}
