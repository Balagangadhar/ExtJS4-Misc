Ext.define('Post', {
    extend: 'Ext.data.Model',
    fields: ['id', 'user_id'],

    belongsTo: 'User',
    hasMany  : {model: 'Comment', name: 'comments'}
});

Ext.define('Comment', {
    extend: 'Ext.data.Model',
    fields: ['id', 'user_id', 'post_id'],

    belongsTo: 'Post'
}); 

Ext.define('User', {
    extend: 'Ext.data.Model',
    fields: ['id'],

    hasMany: [
        'Post',
        {model: 'Comment', name: 'comments'}
    ],
	setData : function(rawData) {
		var me = this;
		var fields = me.fields.items;
		var ln = fields.length;
		var isArray = Ext.isArray(rawData);
		var data = me.data = {};
		var i;
		var field;
		var name;
		var value;
		var convert;
		var id;
		if (!rawData) {
			return me;
		}
		for (i = 0; i < ln; i++) {
			field = fields[i];
			name = field.name;
			convert = field.convert;
			if (isArray) {
				value = rawData[i];
			} else {
				value = rawData[name];
				if (typeof value == 'undefined') {
					value = field.defaultValue;
				}
			}
			if (convert) {
				value = field.convert(value, me);
			}

			data[name] = value;
		}

		id = me.getId();
		if (me.associations.length) {
			me.handleInlineAssociationData(rawData);
		}
		return me;
	},

	handleInlineAssociationData : function(data) {
		var associations = this.associations.items;
		var ln = associations.length;
		var i;
		var association;
		var associationData;
		var reader;
		var proxy;
		varassociationKey;

		data = Ext.apply({}, data, this.raw);

		for (i = 0; i < ln; i++) {
			association = associations[i];
			associationKey = association.associatedKey;
			associationData = data[associationKey];

			if (associationData) {
				reader = association.getReader();
				if (!reader) {
					proxy = association.associatedModel.getProxy();
					if (proxy) {
						reader = proxy.getReader();
					} else {
						reader = new Ext.data.JsonReader({
							model : association.getAssociatedModel()
						});
					}
				}
				association.read(this, reader, associationData);
			}
		}
	}
});
