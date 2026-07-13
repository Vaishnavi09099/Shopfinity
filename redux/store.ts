import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import vendorSlice from './vendorSlice'
import orderSlice from './orderSlice'
// ...

export const store = configureStore({
  reducer: {
    user:userSlice,
    vendor:vendorSlice,
    order:orderSlice
  
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch