import { useMemo } from 'react'

import { useMaxProducts } from '../services/max/products'
import { usePWACashback } from '../services/pwa/cashback'
import { usePWACategories } from '../services/pwa/categories'
import { usePWACategoriesOfProdutos } from '../services/pwa/products'
import { usePWAProviders } from '../services/pwa/providers'
import { useRVProducts } from '../services/rv/products'

export function useProductsPWA(idProduct: number) {
  const { data: ProductsRV, isLoading, isFetching } = useRVProducts()
  const {
    data: CashbackPWA,
    isLoading: isLoading2,
    isFetching: isFetching2,
  } = usePWACashback()
  const {
    data: CategoriesPWA,
    isLoading: isLoading3,
    isFetching: isFetching3,
    refetch: refetchCategories,
  } = usePWACategories()
  const {
    data: ProvidersPWA,
    isLoading: isLoading4,
    isFetching: isFetching4,
  } = usePWAProviders()
  const {
    data: ProductsMax,
    isLoading: isLoading5,
    isFetching: isFetching5,
    refetch: refetchProductsMax,
  } = useMaxProducts()
  const {
    data: CategoriesOfProducts,
    isLoading: isLoading6,
    isFetching: isFetching6,
    isFetchedAfterMount: isFetchedAfterMountCategoriesOfProducts,
  } = usePWACategoriesOfProdutos(idProduct)

  const optionsProductsRV = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>
    if (ProductsRV) {
      res = ProductsRV?.map((item) => {
        return {
          value: item.prrv_id,
          label: item.prrv_nome,
        }
      })
    }
    return res
  }, [ProductsRV])

  const optionsProductsMax = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>
    if (ProductsMax) {
      res = ProductsMax?.map((item) => {
        return {
          value: Number(item.id),
          label: item.nome,
        }
      })
    }
    return res
  }, [ProductsMax])

  const optionsCashback = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>
    if (CashbackPWA) {
      res = CashbackPWA?.map((item) => {
        return {
          value: item.cash_id,
          label: item.cash_descricao,
        }
      })
    }
    return res
  }, [CashbackPWA])

  const optionsProviders = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>

    if (ProvidersPWA) {
      res = ProvidersPWA?.map((item) => {
        return {
          value: item.fopw_id,
          label: item.fopw_nome,
        }
      })
    }
    return res
  }, [ProvidersPWA])

  const optionsCategories = useMemo(() => {
    let res = [] as Array<{ value: number; label: string }>
    if (CategoriesPWA) {
      res = CategoriesPWA?.map((item) => {
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
      isLoading ||
      isFetching ||
      isLoading2 ||
      isFetching2 ||
      isLoading3 ||
      isFetching3 ||
      isLoading4 ||
      isFetching4 ||
      isLoading5 ||
      isFetching5 ||
      isLoading6 ||
      isFetching6
    ) {
      return true
    } else {
      return false
    }
  }

  return {
    ProductsRV,
    CashbackPWA,
    CategoriesPWA,
    refetchCategories,
    ProvidersPWA,
    ProductsMax,
    refetchProductsMax,
    CategoriesOfProducts,
    isFetchedAfterMountCategoriesOfProducts,
    optionsProductsRV,
    optionsProductsMax,
    optionsCashback,
    optionsProviders,
    optionsCategories,
    loading: Loading,
  }
}
