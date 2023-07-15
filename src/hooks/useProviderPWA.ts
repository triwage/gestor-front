import { useMemo } from 'react'

import { ListCashback } from '../services/pwa/cashback'
import { ListCategoriesPWA } from '../services/pwa/categories'
import { ListPWAProvidersOfCategories } from '../services/pwa/providers'
import { ListProvidersRV } from '../services/rv/providers'

import { useQueries } from '@tanstack/react-query'

export function useProviderPWA(idProvider: number) {
  const [ProvidersRV, CashbackPWA, CategoriesPWA, ProvidersOfCategories] =
    useQueries({
      queries: [
        { queryKey: ['RVProviders'], queryFn: ListProvidersRV },
        { queryKey: ['PWACashback'], queryFn: ListCashback },
        { queryKey: ['PWACategories'], queryFn: ListCategoriesPWA },
        {
          queryKey: ['PWAProvidersOfCategories'],
          queryFn: () => ListPWAProvidersOfCategories(idProvider),
          cacheTime: Infinity,
        },
      ],
    })

  const optionsProvidersRV = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>
    if (ProvidersRV.data) {
      res = ProvidersRV.data?.map((item) => {
        return {
          value: item.forv_id,
          label: item.forv_provider,
        }
      })
    }
    return res
  }, [ProvidersRV])

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
  }, [CashbackPWA])

  const optionsCategories = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>
    if (CategoriesPWA.data) {
      res = CategoriesPWA.data?.map((item) => {
        return {
          value: item.pcpw_id,
          label: item.pcpw_descricao,
        }
      })
    }
    return res
  }, [CategoriesPWA])

  function Loading() {
    if (
      ProvidersRV.isLoading ||
      ProvidersRV.isFetching ||
      CashbackPWA.isLoading ||
      CashbackPWA.isFetching ||
      CategoriesPWA.isLoading ||
      CategoriesPWA.isFetching ||
      ProvidersOfCategories.isLoading ||
      ProvidersOfCategories.isFetching
    ) {
      return true
    } else {
      return false
    }
  }

  return {
    CashbackPWA: CashbackPWA.data,
    CategoriesPWA: CategoriesPWA.data,
    refetchCategories: CategoriesPWA.refetch,
    isFetchedAfterMountProvidersOfCategories:
      ProvidersOfCategories.isFetchedAfterMount,
    ProvidersOfCategories: ProvidersOfCategories.data,
    optionsProvidersRV,
    optionsCashback,
    optionsCategories,
    loading: Loading,
  }
}
