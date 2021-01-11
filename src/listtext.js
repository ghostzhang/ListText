import sketch from 'sketch'
import UI from 'sketch/ui'
// documentation: https://developer.sketchapp.com/reference/api/

export default function () {
  const doc = context.document;

  const document = sketch.getSelectedDocument();

  const selectedLayers = document.selectedLayers;
  const selectedCount = selectedLayers.length;
  //console.log(isNaN(parseInt(string)))
  if (selectedCount === 0) {
    doc.showMessage("未选中任何对象 ☝🏻");
  } else {
    let string = UI.getStringFromUser('请输入起始值，仅支持正整数', '1');
    //console.log('Selected layers:')
    let j = isNaN(parseInt(string)) ? 1 : parseInt(string);
    // 按图层从上往下的顺序填充
    // TODO: 按视觉顺序填充
    // TODO: 倒序填充
    let newLayers = selectedLayers.layers.reverse();

    newLayers.forEach(function (layer, i) {
      //console.log(i + 1 + '. ' + layer.name + ' type: ' + layer.type);
      // console.log(layer)
      let arr = []

      switch (layer.type) {
        case 'Text':
          layer.text = String(j++)
          break
        case 'SymbolInstance':
          //layer.overrides
          j = inSymbolInstance(layer, j++)
          break
        case 'Group':
          j = inGroup(layer, j++)
          break
      }

    })
  }
}
function inGroup(layer, j) {
  arr = Array.from(layer.layers).reverse()
  arr.forEach(function (layer, i) {
    switch (layer.type) {
      case 'Text':
        layer.text = String(j++)
        break
      case 'SymbolInstance':
        //layer.overrides
        j = inSymbolInstance(layer, j++)
        break
      case 'Group':
        j = inGroup(layer, j++)
        break
    }
  })
  return j
}

function inSymbolInstance(layer, j) {
  let arr = layer.overrides
  arr.forEach(function (layer, i) {
    if (!layer.symbolOverride) {
      layer.value = '' + j++
    }
  });
  return j
}