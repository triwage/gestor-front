import { MaxProductsProps } from '../@types/max/products'

import { create } from 'zustand'

interface EditProductPWAStoreProps {
  allProductMax: MaxProductsProps[] | null
  productMax: MaxProductsProps | null
  setProductMax: (data: MaxProductsProps) => void
  setAllProductMax: (data: MaxProductsProps[] | null) => void
}

export const useEditProductPWAStore = create<EditProductPWAStoreProps>(
  (set) => ({
    allProductMax: null,
    productMax: null,
    setAllProductMax: (data: MaxProductsProps[] | null) => {
      set(() => ({
        allProductMax: data,
      }))
    },
    setProductMax: (data: MaxProductsProps | null) => {
      set(() => ({
        productMax: data,
      }))
    },
  }),
)
