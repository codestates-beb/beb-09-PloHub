module.exports = (sequelize, DataTypes) => {
    const nftsDaemon = sequelize.define(
        'nfts', 
        {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        
      }, {
        timestamps: false,
        tableName: 'nftsDaemon'
      }
      );

      nfts.associate = (models) => {
        nfts.belongsTo(models.nftsDaemon, { foreignKey: 'user_id' });
      };

    return nfts;
}