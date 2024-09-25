import { ref } from 'vue'
import PocketBase from 'pocketbase'

export function usePocketBase() {
  const config = useRuntimeConfig()
  const pocketbaseUrl = config.public.pocketbaseUrl as string

  if (!pocketbaseUrl) {
    console.error('POCKETBASE_URL is not defined in the environment variables')
  }

  const pb = new PocketBase(pocketbaseUrl)
  const currentUser = ref(pb.authStore.model)

  pb.authStore.onChange((auth) => {
    console.log('authStore changed', auth)
    currentUser.value = pb.authStore.model
  })

  const loginWithGoogle = async () => {
    try {
      const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' })
      console.log('Google OAuth successful', authData)
      return authData
    } catch (error) {
      console.error('Google OAuth failed', error)
      throw error
    }
  }

  const logout = () => {
    pb.authStore.clear()
  }

  return {
    pb,
    currentUser,
    loginWithGoogle,
    logout
  }
}