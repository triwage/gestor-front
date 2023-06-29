import { create } from 'zustand'

interface MaxProductsStoreProps {
  currentStatus: number
  setCurrentStatus: (status: number) => void
}

export const useMaxProductsStore = create<MaxProductsStoreProps>((set) => ({
  currentStatus: 1,
  setCurrentStatus: (status: number) => {
    set(() => ({
      currentStatus: status,
    }))
  },
}))
