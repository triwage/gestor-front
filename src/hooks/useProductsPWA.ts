import { useMemo } from 'react'

import { ListMaxProducts } from '../services/max/products'
import { ListCashback } from '../services/pwa/cashback'
import { ListCategoriesPWA } from '../services/pwa/categories'
import { ListPWACategoriesOfProducts } from '../services/pwa/products'
import { ListProvidersPWA } from '../services/pwa/providers'
import { ListProductsRV } from '../services/rv/products'
import { ListProvidersRV } from '../services/rv/providers'

import { useQueries } from '@tanstack/react-query'

export function useProductsPWA(idProduct: number) {
  const [
    ProductsRV,
    CashbackPWA,
    CategoriesPWA,
    ProvidersPWA,
    ProductsMax,
    CategoriesOfProducts,
    ProvidersRV,
  ] = useQueries({
    queries: [
      { queryKey: ['RVProducts'], queryFn: ListProductsRV },
      { queryKey: ['PWACashback'], queryFn: ListCashback },
      { queryKey: ['PWACategories'], queryFn: ListCategoriesPWA },
      { queryKey: ['PWAProviders'], queryFn: ListProvidersPWA },
      {
        queryKey: ['MaxProducts', 1, 0],
        queryFn: async () => await ListMaxProducts(1, 0),
      },
      {
        queryKey: ['PWACategoriesOfProducts'],
        queryFn: async () => await ListPWACategoriesOfProducts(idProduct),
      },
      { queryKey: ['RVProviders'], queryFn: ListProvidersRV },
    ],
  })

  const optionsProductsRV = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>
    if (ProductsRV.data) {
      res = ProductsRV.data?.map((item) => {
        return {
          value: item.prrv_id,
          label: item.prrv_nome,
        }
      })
    }
    return res
  }, [ProductsRV.data])

  const optionsProductsMax = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>
    if (ProductsMax.data) {
      res = ProductsMax.data?.map((item) => {
        return {
          value: Number(item.id),
          label: item.nome,
        }
      })
    }
    return res
  }, [ProductsMax.data])

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
  }, [CategoriesPWA.data])

  function Loading() {
    if (
      ProductsRV.isLoading ||
      ProductsRV.isFetching ||
      CashbackPWA.isLoading ||
      CashbackPWA.isFetching ||
      CategoriesPWA.isLoading ||
      CategoriesPWA.isFetching ||
      ProvidersPWA.isLoading ||
      ProvidersPWA.isFetching ||
      ProductsMax.isLoading ||
      ProductsMax.isFetching ||
      CategoriesOfProducts.isLoading ||
      CategoriesOfProducts.isFetching ||
      ProvidersRV.isLoading ||
      ProvidersRV.isFetching
    ) {
      return true
    } else {
      return false
    }
  }

  return {
    ProductsRV: ProductsRV.data,
    CashbackPWA: CashbackPWA.data,
    CategoriesPWA: CategoriesPWA.data,
    refetchCategories: CategoriesPWA.refetch,
    refetchProviders: ProvidersPWA.refetch,
    ProvidersPWA: ProvidersPWA.data,
    ProvidersRV: ProvidersRV.data,
    ProductsMax: ProductsMax.data,
    refetchProductsMax: ProductsMax.refetch,
    CategoriesOfProducts: CategoriesOfProducts.data,
    isFetchedAfterMountCategoriesOfProducts:
      CategoriesOfProducts.isFetchedAfterMount,
    optionsProductsRV,
    optionsProductsMax,
    optionsCashback,
    optionsProviders,
    optionsCategories,
    loading: Loading,
  }
}
