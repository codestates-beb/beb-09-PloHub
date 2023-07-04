module.exports = (sequelize, DataTypes) => {
  const Wallets = sequelize.define(
    'Wallets',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      encrypted_private_key: {
        type: DataTypes.STRING,
        allowNull: false
      },
      eth_amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      token_amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'wallets',
      timestamps: false
    }
  );

  Wallets.associate = (models) => {
    Wallets.belongsTo(models.Wallets, { foreignKey: 'user_id' });
  };

  return Wallets;
};