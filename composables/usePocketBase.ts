import { ref } from 'vue'
import PocketBase from 'pocketbase'

export function usePocketBase() {
  const config = useRuntimeConfig()
  const pocketbaseUrl = config.public.pocketbaseUrl as string

  if (!pocketbaseUrl) {
    console.error('POCKETBASE_URL is not defined in the environment variables')
  }

  const pb = new PocketBase(pocketbaseUrl)

  //Auth
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

// Blog posts
const getPostBySlug = async (slug: string) => {
  try {
    const record = await pb.collection('posts').getFirstListItem(`slug="${slug}"`, {
      expand: 'author'
    });
    return record;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    throw error;
  }
}
const getAllPosts = async () => {
  try {
    const records = await pb.collection('posts').getFullList({
      sort: '-created',
      filter: 'is_published = true',
      expand: 'author',
      
    });
    return records;
  } catch (error) {
    console.error('Error fetching all posts:', error);
    throw error;
  }
}
const getImageUrl = (item: any) => {
  if (item && item.image) {
    return pb.files.getUrl(item, item.image, { thumb: "800x0" });
  }
  return "";
};

  return {
    pb,
    currentUser,
    loginWithGoogle,
    logout,
    getPostBySlug,
    getAllPosts,
    getImageUrl
  }
}