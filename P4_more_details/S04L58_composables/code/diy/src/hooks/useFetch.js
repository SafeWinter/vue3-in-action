import { ref, watchEffect, toValue } from 'vue'
export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  watchEffect(() => {
    // 每次执行 fetchData 的时候，重制 data 和 error 的值
    data.value = null
    error.value = null

    const urlValue = toValue(url)

    if (urlValue === '') {
      data.value = null
      error.value = 'invalid url: empty string is not allowed, pls update it with a valid one'
    } else {
      fetch(urlValue)
        .then((res) => res.json())
        .then((json) => (data.value = json))
        .catch((err) => (error.value = err))
    }
  })

  return { data, error }
}
