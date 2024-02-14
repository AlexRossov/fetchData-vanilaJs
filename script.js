const fetchData = async () => {
  try {
    const response = await fetch('db.json');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    const items = data.services;

    const list = document.getElementById('wrapListItems');
    list.addEventListener("click", toggleNode);

    const treeData = createTreeData(items, 'id', 'head');
    const sortedData = sortBySorthead(treeData);
    list.innerHTML = createTreeHTML(sortedData);
    document.getElementById('btn').setAttribute('disabled', '');
  } catch (error) {
    console.error('An error occurred while fetching data:', error);
  }
};

const toggleNode = (e) => {
  if (e.target.classList.contains("node")) {
    e.target.classList.toggle("show");
  }
};


const createTreeData = (data, id, parentId) => {
  const tree = Object.fromEntries(data.map(node => [node[id], { ...node, children: [] }]));

  Object.values(tree).forEach(node => {
    const parentNode = tree[node[parentId]];
    if (parentNode) {
      parentNode.children.push(node);
    }
  });

  return Object.values(tree).filter(node => !tree[node[parentId]]);
};


const sortBySorthead = (data) => {
  const sortedData = JSON.parse(JSON.stringify(data));

  const sortRecursively = (items) => {
    items.sort((a, b) => a.sorthead > b.sorthead ? 1 : -1);
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        sortRecursively(item.children);
      }
    });
  };

  sortRecursively(sortedData);
  return sortedData;
};


const createTreeHTML = (data) => {
  if (!Array.isArray(data) || data.length === 0) return '';

  const generateItemHTML = (item) => {
    const priceHTML = item.price === 0 ? '' : ` (${item.price} руб.)`;
    const nodeClass = item.node === 1 ? 'node' : '';
    return `
      <li class="item ${nodeClass}">
        ${item.name}${priceHTML}
        ${createTreeHTML(item.children)}
      </li>
    `;
  };

  const itemsHTML = data.map(item => generateItemHTML(item)).join('\n');
  return `<ul class='listItems'>\n${itemsHTML}\n</ul>`;
};

