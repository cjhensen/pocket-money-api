const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
  userInfo: {
    username: String,
    password: String
  },
  userData: {
    categories: [{
      categoryName: String,
      totalBudget: Number,
      _id: false
    }],
    transactions: [{
      transactionName: String,
      category: String,
      moneySpent: Number,
      transactionRecurring: Boolean,
      _id: false
    }],
    income: [{
      incomeName: String,
      incomeAmount: Number,
      incomeRecurring: Boolean,
      _id: false
    }]
  }
});

userSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    username: this.userInfo.username,
    categories: this.userData.categories,
    transactions: this.userData.transactions,
    income: this.userData.income
  }
}

userSchema.methods.generateHash = function(password) {
  console.log('generating a password hash');
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validatePassword = function(password) {
  console.log('validating password');
  return bcrypt.compareSync(password, this.userInfo.password);
}

const User = mongoose.model('User', userSchema);

module.exports = {
  User
};