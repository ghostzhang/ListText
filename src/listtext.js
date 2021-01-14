import sketch from 'sketch'
import UI from 'sketch/ui'
// documentation: https://developer.sketchapp.com/reference/api/

export default function () {
  const doc = context.document

  const document = sketch.getSelectedDocument()

  const selectedLayers = document.selectedLayers
  const selectedCount = selectedLayers.length
  const getID = document.getLayerWithID
  //console.log(isNaN(parseInt(string)))
  if (selectedCount === 0) {
    doc.showMessage("未选中任何对象 ☝🏻");
  } else {
    // TODO: 自定义起始数字
    // TODO: 自定义位数，不足补0
    // TODO: 横向优先
    // TODO: 倒序填充
    let string = '1';
    //console.log('Selected layers:')
    let j = isNaN(parseInt(string)) ? 1 : parseInt(string);
    // 按图层从上往下的顺序填充
    let _newLayers_ = []
    let newLayers = orderLayers(selectedLayers.layers, _newLayers_);

    newLayers.forEach(function (newLayer, i) {
      const layer = newLayer[4]
      if (newLayer[3] == "Text" && !layer.hidden) {
        layer.text = String(j++)
      }
      if (newLayer[3] == "SymbolInstance" && !layer.affectedLayer.hidden) {
        layer.value = String(j++)
      }

    })
  }
}

function sortInGroup(layer, layerXY, _newLayers_) {
  console.log("------sortInGroup------")
  // 父级坐标
  const layerX = layerXY[0]
  const layerY = layerXY[1]
  // 取得子元素
  let groupLayers = Array.from(layer.layers)
  groupLayers.forEach(function (groupLayer, i) {
    let _X_ = layerX + groupLayer.frame.x
    let _Y_ = layerY + groupLayer.frame.y
    switch (groupLayer.type) {
      case 'Text':
        _newLayers_.push([groupLayer.id, [_X_, _Y_], "", groupLayer.type, groupLayer])
        break
      case 'SymbolInstance':
        _newLayers_ = sortInSymbolInstance(groupLayer, [_X_, _Y_], _newLayers_)
        break
      case 'Group':
        _newLayers_ = sortInGroup(groupLayer, [_X_, _Y_], _newLayers_)
        break
    }
  })
  return _newLayers_
}

function sortInSymbolInstance(layer, layerXY, _newLayers_) {
  console.log("------sortInSymbolInstance------")
  // 父级坐标
  const layerX = layerXY[0]
  const layerY = layerXY[1]
  // 取得子元素
  let arr = layer.overrides
  // 父级信息[ ID列表，坐标列表 ]
  let parentPath = [[], []]
  if (arr.length > 0) {
    // 有子元素
    arr.forEach(function (override, i) {
      // 子元素路径
      let overridePath = override.path
      let _X_ = layerX
      let _Y_ = layerY

      if (override.property == "symbolID") {
        console.log('-------parentPath--------')
        parentPath[0].push(overridePath)
        _X_ = _X_ + override.affectedLayer.frame.x
        _Y_ = _Y_ + override.affectedLayer.frame.y
        // 获取父节点
        let _overridePath_ = overridePath.split('/')
        _overridePath_.pop()
        let _parentPath_ = _overridePath_.join('/')
        if (_parentPath_ != '') {
          // 有父节点
          // 取得子元素父节点坐标
          const index = (e) => e == _parentPath_
          const parentPathIndex = parentPath[0].findIndex(index)
          const parentOverrIdeFrame = parentPath[1][parentPathIndex]
          // 保存当前子元素节点信息
          _X_ = parentOverrIdeFrame[0] + override.affectedLayer.frame.x
          _Y_ = parentOverrIdeFrame[1] + override.affectedLayer.frame.y
        }
        parentPath[1].push([_X_, _Y_])
      } else {
        // 普通节点
        console.log('-------override--------')
        // 取得当前节点的父节点，没有时为空
        let _overridePath_ = overridePath.split('/')
        _overridePath_.pop()
        let _parentPath_ = _overridePath_.join('/')
        if (_parentPath_ != '') {
          // 有父节点
          // 取得子元素父节点坐标
          const index = (e) => e == _parentPath_
          const parentPathIndex = parentPath[0].findIndex(index)
          const parentOverrIdeFrame = parentPath[1][parentPathIndex]
          // 保存当前子元素节点信息
          _X_ = parentOverrIdeFrame[0] + override.affectedLayer.frame.x
          _Y_ = parentOverrIdeFrame[1] + override.affectedLayer.frame.y
        } else {
          _X_ = _X_ + override.affectedLayer.frame.x
          _Y_ = _Y_ + override.affectedLayer.frame.y
        }
        _newLayers_.push([override.id, [_X_, _Y_], layer.id, layer.type, override])
      }
    })
  }
  return _newLayers_
}
// 排序图层
function orderLayers(selectedLayers, _newLayers_) {

  selectedLayers.forEach(function (layer, i) {
    console.log('-------orderLayers--------')
    // console.log(layer)
    let layerX = layer.frame.x
    let layerY = layer.frame.y
    let layerXY = [layerX, layerY]
    switch (layer.type) {
      case 'Text':
        _newLayers_.push([layer.id, layerXY, "", layer.type, layer])
        break
      case 'SymbolInstance':
        //layer.overrides
        _newLayers_ = sortInSymbolInstance(layer, layerXY, _newLayers_)
        break
      case 'Group':
        _newLayers_ = sortInGroup(layer, layerXY, _newLayers_)
        break
    }
  })
  if (_newLayers_.length > 1) {
    _newLayers_.sort(function (a, b) {
      return (a[1][1] - b[1][1]) == 0 ? a[1][0] - b[1][0] : a[1][1] - b[1][1]
    })
  }
  console.log('-------sort--------')

  return _newLayers_
}