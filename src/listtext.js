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
          arr = layer.overrides
          arr.forEach(function (layer, i) {
            layer.value = '' + j++
          });
          break
      }

      doc.showMessage("Done 👍🏻")
    })
  }
}
