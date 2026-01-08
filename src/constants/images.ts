export const CATEGORY_IMAGES: Record<string, string> = {
    'Politics': 'https://images.unsplash.com/photo-1541872703-74c59636a226?auto=format&fit=crop&w=200&q=80',
    'Economics': 'https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&w=200&q=80',
    'Crypto': 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=200&q=80',
    'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=200&q=80',
    'Culture': 'https://images.unsplash.com/photo-1514525253440-b393452e3383?auto=format&fit=crop&w=200&q=80',
    'Tech & Science': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=200&q=80',
    'World': 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=200&q=80',
    'Health': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=200&q=80',
    'Default': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=200&q=80'
};

export const preloadImages = () => {
    Object.values(CATEGORY_IMAGES).forEach((src) => {
        const img = new Image();
        img.src = src;
    });
};
