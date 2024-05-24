// 用于替换 process.env.xxx 为对应的环境变量值
module.exports = function ({ types: t }) {
    function isLeftSideOfAssignmentExpression(path) {
      return t.isAssignmentExpression(path.parent) && path.parent.left === path.node
    }
  
    return {
      name: 'babel-plugin-replace-env-vars',
      visitor: {
        MemberExpression(path, { opts: { exclude } = {} }) {
          // 检查是否是 process.env.xxx 表达式
          if (path.get('object').matchesPattern('process.env')) {
            const key = path.toComputedKey()
            // 确保 key 是一个字符串字面量且不在赋值表达式的左侧，并且不在排除列表中
            if (t.isStringLiteral(key) && !isLeftSideOfAssignmentExpression(path) && (!exclude || exclude.indexOf(key.value) === -1)) {
              const value = process.env[key.value]
  
              // 如果环境变量不存在，替换为 undefined
              if (typeof value === 'undefined') {
                path.replaceWith(t.identifier('undefined'))
              } else {
                // 替换成对应的值
                path.replaceWith(t.valueToNode(value))
              }
            }
          }
        }
      }
    }
  }
  