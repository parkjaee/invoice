import { useEffect, useState } from 'react';
import { fetchUsers } from '../services/userService';

export default function useUsers(initial = {}) {
    const [params, setParams] = useState({ languageCode: 'KO', usableFlag: '', page: 0, size: 20, ...initial });
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({ code: null, message: null, error: false });
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const { list, meta } = await fetchUsers(params);
                if (!cancelled) { setData(list); setMeta(meta); }
            } catch (e) {
                if (!cancelled) setErr(e?.message || 'load failed');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [JSON.stringify(params)]); // 간단 디펜던시

    return { data, meta, loading, err, params, setParams };
}
