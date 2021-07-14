const withAdmin = (authority: API.Authority[] = []): API.Authority[] => {
  return authority.concat('admin');
};

const user = withAdmin(['user']);
const admin = withAdmin();
const visitor = withAdmin(['visitor']);

const hasEqual = (origin: API.Authority[] = [], target: API.Authority[]) => {
  const mergedList = [...target, ...origin];
  const distinctList = [...new Set(mergedList)];
  return mergedList.length !== distinctList.length;
};

export default function(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  const includes = hasEqual.bind(null, currentUser?.authority);
  return {
    canUser: includes(user),
    canAdmin: includes(admin),
    canVisitor: includes(visitor),
    canNot:false
  };
}
