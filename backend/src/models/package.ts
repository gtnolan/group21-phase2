import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';

export interface PackageAttributes {
  ID?: number;
  name: string;
  contentUpload: boolean;
}

export interface PackageCreationAttributes extends Omit<PackageAttributes, 'ID'> {}

export class Package extends Model<PackageAttributes, PackageCreationAttributes> implements PackageAttributes {
  public ID!: number;
  public name!: string;
  public contentUpload!: boolean;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Package.init({
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: new DataTypes.STRING(128),
    unique: true,
    allowNull: false
  },
  contentUpload: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  }
}, {
  sequelize,
  tableName: 'packages',
  timestamps: true
});
