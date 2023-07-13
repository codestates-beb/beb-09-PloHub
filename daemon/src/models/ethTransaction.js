module.exports = (sequelize,DataTypes) => {
    const ethTransaction = sequelize.define(
        'ethTransaction',
        {
    id : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    hash: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    nonce: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    blockHash: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    blockNumber: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    transactionIndex: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    from: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    to: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gas: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    gasPrice: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    input: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    v: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    r: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    s: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
    }
},{
    timestamps: false,
    tableName: 'ethTransaction'
});

ethTransaction.associate = (models) => {
    ethTransaction.belongsTo(models.ethTransaction, {foreignKey: 'blockNumber'})
    }
    return ethTransaction;
};