import client from '../../common/client.js';

export async function fetchUsers(params = {}) {
    const res = await client.get('api/caps/users', {params});
    const body = res.data;
    // 백엔드가 List<UserDto> 또는 {data,code,message,error} 둘다 대응
    const list = Array.isArray(body) ? body : (body?.data || []);
    const meta = Array.isArray(body)
     ? { code: null, message: null, error: false }
        : {code: body?.code ?? null, message: body?.message ?? null, error: !!body?.error};
    return {list, meta};
}