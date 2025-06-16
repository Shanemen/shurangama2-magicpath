// 楞严经思维导图数据结构
// 基于用户提供的详细思维导图

const surangamaData = {
  // 根节点
  root: {
    id: 'root',
    title: '大佛顶首楞严经',
    parent_id: null,
    order_index: 1,
    has_content: false
  },
  
  // 主要分支
  mainSections: [
    {
      id: 'xufen',
      title: '序分',
      parent_id: 'root',
      order_index: 1,
      has_content: false
    },
    {
      id: 'zhengzongfen',
      title: '正宗分',
      parent_id: 'root',
      order_index: 2,
      has_content: false
    },
    {
      id: 'liutongfen',
      title: '流通分',
      parent_id: 'root',
      order_index: 3,
      has_content: false
    }
  ],

  // 序分的子节点
  xufen_children: [
    {
      id: 'zhengxinxu',
      title: '证信序',
      parent_id: 'xufen',
      order_index: 1,
      has_content: true,
      content: '如是我闻，一时，佛在室罗筏城，祇桓精舍。'
    },
    {
      id: 'faqixu',
      title: '发起序',
      parent_id: 'xufen',
      order_index: 2,
      has_content: false
    }
  ],

  // 发起序的详细分支
  faqixu_children: [
    {
      id: 'xianming_zhengyi',
      title: '先明五义',
      parent_id: 'faqixu',
      order_index: 1,
      has_content: true,
      content: '如是我闻，一时，佛在室罗筏城，祇桓精舍。与大比丘众，千二百五十人俱。'
    },
    {
      id: 'zuichu_zhongzhong',
      title: '最初众众',
      parent_id: 'faqixu',
      order_index: 2,
      has_content: false
    },
    {
      id: 'jiben_gongde',
      title: '基本功德',
      parent_id: 'faqixu',
      order_index: 3,
      has_content: true,
      content: '皆是无漏大阿罗汉，佛子住持，善超诸有；能于国土，成就威仪；从佛转轮，妙堪遗嘱；严净毗尼，弘范三界；应身无量，度脱众生；拔济未来，越诸尘累。'
    },
    {
      id: 'bieming_liesheng',
      title: '别名列圣',
      parent_id: 'faqixu',
      order_index: 4,
      has_content: true,
      content: '其名曰：大智舍利弗、摩诃目犍连、摩诃拘絺罗、富楼那弥多罗尼子、须菩提、优波尼沙陀等，而为上首。'
    },
    {
      id: 'pusa_zhongzhong',
      title: '菩萨众众',
      parent_id: 'faqixu',
      order_index: 5,
      has_content: true,
      content: '复有无量辟支无学，并其初心，同来佛所，属诸比丘，休夏自恣。'
    },
    {
      id: 'zizai_wangzhong',
      title: '自在王众',
      parent_id: 'faqixu',
      order_index: 6,
      has_content: true,
      content: '十方菩萨，咨决心疑，钦奉慈严，将求密义。即时如来，敷座宴安，为诸会中，宣示深奥。'
    },
    {
      id: 'nanyinhou_zhizhong',
      title: '南印后至众',
      parent_id: 'faqixu',
      order_index: 7,
      has_content: true,
      content: '调伏诸根，身心寂静，来求道者，皆获所愿。文殊师利，而为上首。'
    }
  ],

  // 正宗分的主要内容
  zhengzongfen_children: [
    {
      id: 'wangchen_shewen',
      title: '王臣设问',
      parent_id: 'zhengzongfen',
      order_index: 1,
      has_content: false
    },
    {
      id: 'fotuoshehua',
      title: '佛陀设化',
      parent_id: 'zhengzongfen',
      order_index: 2,
      has_content: false
    }
  ],

  // 王臣设问的详细内容
  wangchen_shewen_children: [
    {
      id: 'wangchen_shewen_detail1',
      title: '时波斯匿王，为其父王，讳日营斋，请佛宫掖，自迎如来，广设珍馐，无上妙味，兼复亲延诸大菩萨。城中复有长者、居士，同时饭僧，伫佛来应。佛敕文殊，分领菩萨，及阿罗汉，应诸斋主。',
      parent_id: 'wangchen_shewen',
      order_index: 1,
      has_content: true,
      content: '时波斯匿王，为其父王，讳日营斋，请佛宫掖，自迎如来，广设珍馐，无上妙味，兼复亲延诸大菩萨。城中复有长者、居士，同时饭僧，伫佛来应。佛敕文殊，分领菩萨，及阿罗汉，应诸斋主。'
    }
  ],

  // 佛陀设化的详细分支
  fotuoshehua_children: [
    {
      id: 'wangchen_shewen_sub',
      title: '王臣设问',
      parent_id: 'fotuoshehua',
      order_index: 1,
      has_content: false
    },
    {
      id: 'fofo_shehua_sub',
      title: '佛佛设化',
      parent_id: 'fotuoshehua',
      order_index: 2,
      has_content: false
    }
  ],

  // 佛佛设化的进一步分支
  fofo_shehua_children: [
    {
      id: 'bieqing_fangbian',
      title: '别请方便',
      parent_id: 'fofo_shehua_sub',
      order_index: 1,
      has_content: true,
      content: '唯有阿难，先受别请，远游未还，不遑僧次，途中独归。'
    },
    {
      id: 'wuchu_duogui',
      title: '无处独归',
      parent_id: 'fofo_shehua_sub',
      order_index: 2,
      has_content: true,
      content: '既无上座，及阿阇梨，途中独归。'
    },
    {
      id: 'wuchu_dehe',
      title: '无处得何',
      parent_id: 'fofo_shehua_sub',
      order_index: 3,
      has_content: true,
      content: '既日时欲，即时阿难，执持应器，于所游城，次第循乞。'
    },
    {
      id: 'zhengxing_dengxu',
      title: '正行等序',
      parent_id: 'fofo_shehua_sub',
      order_index: 4,
      has_content: true,
      content: '心中初求，最后檀越，以为斋主，无问净秽，刹利尊姓，及旃陀罗。'
    }
  ]
};

// 将所有节点合并为一个数组，便于批量插入
function getAllNodes() {
  const allNodes = [];
  
  // 添加根节点
  allNodes.push(surangamaData.root);
  
  // 添加主要分支
  allNodes.push(...surangamaData.mainSections);
  
  // 添加序分子节点
  allNodes.push(...surangamaData.xufen_children);
  
  // 添加发起序子节点
  allNodes.push(...surangamaData.faqixu_children);
  
  // 添加正宗分子节点
  allNodes.push(...surangamaData.zhengzongfen_children);
  
  // 添加王臣设问子节点
  allNodes.push(...surangamaData.wangchen_shewen_children);
  
  // 添加佛陀设化子节点
  allNodes.push(...surangamaData.fotuoshehua_children);
  
  // 添加佛佛设化子节点
  allNodes.push(...surangamaData.fofo_shehua_children);
  
  return allNodes;
}

// 生成内容数据（只为有内容的节点）
function getContentData() {
  const allNodes = getAllNodes();
  const contentData = [];
  
  allNodes.forEach(node => {
    if (node.has_content && node.content) {
      contentData.push({
        node_id: node.id,
        original_text: node.content,
        simplified_text: null, // 可以后续添加白话文
        content_order: 1
      });
    }
  });
  
  return contentData;
}

// 导出数据
const exportData = {
  nodes: getAllNodes(),
  contents: getContentData(),
  summary: {
    totalNodes: getAllNodes().length,
    nodesWithContent: getContentData().length,
    structure: {
      '序分': surangamaData.xufen_children.length + surangamaData.faqixu_children.length,
      '正宗分': surangamaData.zhengzongfen_children.length + surangamaData.wangchen_shewen_children.length + surangamaData.fotuoshehua_children.length + surangamaData.fofo_shehua_children.length,
      '流通分': 0 // 暂未添加详细内容
    }
  }
};

// 在控制台显示数据概览
console.log('=== 楞严经思维导图数据概览 ===');
console.log(`总节点数: ${exportData.summary.totalNodes}`);
console.log(`有内容的节点数: ${exportData.summary.nodesWithContent}`);
console.log('各部分节点分布:', exportData.summary.structure);
console.log('\n=== 节点结构预览 ===');
exportData.nodes.forEach(node => {
  const indent = node.parent_id ? (node.parent_id === 'root' ? '├── ' : '    ├── ') : '';
  const contentMark = node.has_content ? ' 📄' : '';
  console.log(`${indent}${node.title}${contentMark}`);
});

module.exports = exportData; 