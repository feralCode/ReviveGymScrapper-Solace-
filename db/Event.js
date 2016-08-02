'use strict';
function EventSchema(db, DataTypes) {
  var model = db.define('Event', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        validate: {
          notEmpty: true,
          isUUID: 4
        }
      },
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      gymId: DataTypes.STRING,
      category: DataTypes.STRING,
      categoryId: DataTypes.STRING,
      trainer: DataTypes.STRING,
      trainerId: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE
    },
    {
      tableName: 'event',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['startDate', 'title', 'gymId']
        }
      ]
    });
  return model;
}


/**
 * IncidentSchema Module
 */
module.exports = EventSchema;
