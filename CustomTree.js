Ext.define('App.view.common.CustomTree', {
 extend : 'Ext.tree.Panel',
 convertToStore : function(model) {
  if (this.getStore() === null) {
   return null;
  }
  var rootNode = this.getStore().getRootNode();
  model = model || Ext.getClassName(this.getStore().getRootNode());
  dataStore = this.convertNodeToStore(rootNode, model);
  return dataStore.childrenStore;
 },
convertNodeToStore : function(rootNode, model) {
 var record = Ext.create(model);
 record.data = rootNode.data;
 if (record.childrenStore === null || typeof record.childrenStore === 'undefined') {
  record.childrenStore = Ext.create('Ext.data.Store', {
   model : model
  });
 }
 for (var i = 0; i < rootNode.childNodes.length; i++) {
  var cNode = rootNode.childNodes[i];
  var child = this.convertNodeToStore(cNode, model);
  if (cNode.dirty || cNode.phantom) {
   record.childrenStore.add(child);
   rootNode.setDirty();
  }
 }
 return record;
}
