app.controller('FunctionalSpendController', ['$http', 'AuthFactory', 'TemplateFactory', 'BudgetFactory', function ($http, AuthFactory, TemplateFactory, BudgetFactory) {
	console.log('Functional Spend controller started');

	var self = this;
	self.newFunctionalBudget = {};
	var templateFactory = TemplateFactory;
	self.itemArray = templateFactory.getItemTemplate("Functional");
	var budgetFactory = BudgetFactory;
	

	console.log("itemArray ", self.itemArray);
	 

	// adding false value to itemArray
	removeActiveToggles();

	// toggles activeitem value for each item
	self.toggleActive = function (item) {
		if (item.activeitem === false) {
			item.activeitem = true;
		} else {
			item.activeitem = false;
		}
	};

	// removes all active values in individual functional items
	function removeActiveToggles() {
		for (var i = 0; i < self.itemArray.length; i++) {
			var item = self.itemArray[i];
			item.activeItem = false;
		}
	}

	self.postFunctionalItems = function () {
		console.log('post functional items clicked');
		// budgetFactory.postFunctionalItems(functionalArray)
		budgetFactory.postFunctionalItems(self.itemArray)
			.then(function (result) {
					console.log('Functional items inserted ', self.itemArray);
					return;
				},
				function (err) {
					console.log('Error inserting functional items for', currentUser.email, ': ', err);
					return;
				});
	};

	self.getFunctionalItems = function () {
		console.log("getFinancialItems is clicked");
		budgetFactory.getFunctionalItems()
			.then(function (result) {
				console.log("getFunctionalItems ", result)
				self.itemArray = result;
				// console.log('WelcomeController itemArray', self.itemArray);
			});
	};

	self.updateFunctionalItems = function () {
		console.log("update functional clicked ");
		budgetFactory.updateFunctionalItems()
			.then(function (result) {
				self.iItemArray = result;
			});
			window.location = '/#/financialspend'
	};

}]);


// var functionalArray = [{
// 		item_amount: 1000,
// 		item_name: 'Rent | Mortgage'
//             },
// 	{
// 		item_amount: 500,
// 		item_name: 'Daycare'
//             },
// 	{
// 		item_amount: 40,
// 		item_name: 'Cars'
//             },
// 	{
// 		item_amount: 150,
// 		item_name: 'P&C Insurance'
//             },
// 	{
// 		item_amount: 150,
// 		item_name: 'Cell Phone'
//             },
// 	{
// 		item_amount: 200,
// 		item_name: 'Utilities'
//             },
// 	{
// 		item_amount: 150,
// 		item_name: 'Student Loans'
//             },
// 	{
// 		item_amount: 150,
// 		item_name: 'Credit Card | Loans'
//             },
// 	{
// 		item_amount: 110,
// 		item_name: 'Gas'
//             }
//         ];
