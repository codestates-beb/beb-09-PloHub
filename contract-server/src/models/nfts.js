module.exports = (sequelize, DataTypes) => {
    const nfts = sequelize.define(
        'nfts', 
        {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        owner_address: {
          type: DataTypes.STRING,
          allowNull: false
        },
        token_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        token_uri: {
          type: DataTypes.STRING,
          allowNull: false
        },
        price: {
          type: DataTypes.DECIMAL(20, 0),
          defaultValue: 0
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false
        },
        image: {
          type: DataTypes.STRING,
          allowNull: false
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        }
      }, {
        timestamps: false,
        tableName: 'nfts'
      }
      );

      nfts.associate = (models) => {
        nfts.belongsTo(models.nfts, { foreignKey: 'user_id' });
      };

    return nfts;
}