
export const createPageUrl = (pageName: string) => {
  return pageName.toLowerCase() === 'home' ? '/' : `/${pageName.toLowerCase()}`;
};
