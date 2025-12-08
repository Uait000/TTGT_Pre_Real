// src/utils/authDebug.ts
export const debugAuth = async () => {
  const token = localStorage.getItem('adminToken');
  console.log('🔐 Debug Auth Information:');
  console.log('Token exists:', !!token);
  console.log('Token length:', token?.length);
  console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'none');
  
  if (token) {
    // Проверим токен на валидность
    try {
      const testResponse = await fetch('/admin/posts/', {
        headers: {
          'x-authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Test request status:', testResponse.status);
      console.log('Test request headers:', Object.fromEntries(testResponse.headers.entries()));
    } catch (error) {
      console.log('Test request error:', error);
    }
  }
};