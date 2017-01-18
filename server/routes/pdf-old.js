var express = require('express');
var router = express.Router();
var pg = require('pg');
// var connectionString = require('../modules/database-config');
var config = require('../modules/pg-config');

var pool = new pg.Pool({
    database: config.database
});

var pdfData = {};


// Route: GET flow monthly totals for a budget
router.get("/", function(req, res, next) {
    pool.connect()
        .then(function(client) {
            var queryString = 'SELECT item_year, item_month, item_name, item_amount ';
            queryString += 'FROM budget_flow_item ';
            queryString += 'WHERE budget_id = $1 ';
            queryString += 'ORDER BY item_year, item_month, item_sort_sequence';
            // console.log('queryString:', queryString);
            client.query(queryString, [req.budgetID], function(err, result) {
                if (err) {
                    console.log('Error getting flow items monthly totals', err);
                    client.release();
                    next();
                } else {
                    console.log('Flow items monthly totals retrieved');
                    formatFlowItems(result.rows);
                    client.release();
                    next();
                }
            });
        });
});

function formatFlowItems(itemMonthArray) {
    console.log('formatFlowItems', itemMonthArray.length);
    var itemMonthColumn = [];
    var itemYear = [];
    var monthTotal = 0;
    var yearTotal = 0;
    for (var i = 0; i < itemMonthArray.length; i++) {
        monthTotal += itemMonthArray[i].item_amount;
        itemMonthColumn.push(itemMonthArray[i]);
        if ((i + 1) % (itemMonthArray.length / 12) === 0) {
            itemMonthColumn.push({
                category_name: 'Flex',
                item_name: 'Monthly Total',
                item_amount: monthTotal
            });
            itemYear.push(itemMonthColumn);
            itemMonthColumn = [];
            monthTotal = 0;
        }
    }
    pdfData.Flow = itemYear;
    // console.log(pdfData.flow);
}

// Route: GET non-flow totals for a budget
router.get("/", function(req, res, next) {
    pool.connect()
        .then(function(client) {
            var queryString = 'SELECT category_name, item_name, item_amount ';
            queryString += 'FROM budget_item, budget_template_category ';
            queryString += 'WHERE budget_template_category.id = budget_template_category_id ';
            queryString += 'AND budget_id = $1 ';
            queryString += 'ORDER BY budget_template_category_id, item_sort_sequence';
            // console.log('queryString:', queryString);
            client.query(queryString, [req.budgetID], function(err, result) {
                if (err) {
                    console.log('Error getting non-flow items monthly totals', err);
                    client.release();
                    next();
                } else {
                    formatNonFlowItems(result.rows);
                    console.log('Non-Flow items monthly totals retrieved');
                    client.release();
                    next();
                }
            });
        });
});

function formatNonFlowItems(itemMonthArray) {
    console.log('formatNonFlowItems', itemMonthArray.length);
    // console.log('itemMonthArray[0]', itemMonthArray[0]);
    var itemMonthColumn = [];
    var monthTotal = 0;
    var yearTotal = 0;
    var currentCategory = itemMonthArray[0].category_name;
    for (var i = 0; i < itemMonthArray.length; i++) {
        monthTotal += itemMonthArray[i].item_amount;
        console.log(i, currentCategory, itemMonthArray[i].item_name, itemMonthArray[i].item_amount);
        itemMonthColumn.push(itemMonthArray[i]);
        if ((i + 1) < itemMonthArray.length) {
            console.log('currentCategory', currentCategory, itemMonthArray[i + 1].category_name);
            if (currentCategory !== itemMonthArray[i + 1].category_name) {
                buildItemYear(currentCategory, monthTotal, itemMonthColumn);
                itemMonthColumn = [];
                monthTotal = 0;
                currentCategory = itemMonthArray[i + 1].category_name;
            }
        } else {
            currentCategory = itemMonthArray[i].category_name;
            buildItemYear(currentCategory, monthTotal, itemMonthColumn);
        }
    }
    // console.log(pdfData.Flex[0]);
    // console.log(pdfData.Flow[0]);
    // console.log(pdfData.Financial[0]);
    // console.log(pdfData.Functional[0]);
}

function buildItemYear(currentCategory, monthTotal, itemMonthColumn) {
  // console.log('buildItemYear', currentCategory, monthTotal);
    var itemYear = [];
    itemMonthColumn.push({
        category_name: currentCategory,
        item_name: 'Monthly Total',
        item_amount: monthTotal
    });
    // console.log('itemMonthColumn:', itemMonthColumn);
    for (var mm = 1; mm <= 12; mm++) {
        itemYear.push(itemMonthColumn);
    }
    pdfData[currentCategory] = itemYear;
}


module.exports = router;