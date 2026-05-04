export function buildTree(list: any[]) {
  const map: any = {};
  const tree: any[] = [];

  list.forEach((item) => {
    map[item.value] = {
      ...item,
      children: [],
    };
  });

  list.forEach((item) => {
    if (item.parent && map[item.parent]) {
      map[item.parent].children.push(map[item.value]);
    } else {
      tree.push(map[item.value]);
    }
  });

  return tree;
}