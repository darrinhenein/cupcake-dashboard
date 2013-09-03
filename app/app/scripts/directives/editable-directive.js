angular.module('cupcakeDashboard')
  .directive("editable", function() {
    var editorTemplate = '<div class="click-to-edit">' +
        '<div ng-hide="view.editorEnabled">' +
            '{{value}} ' +
            '<a ng-click="enableEditor()">Edit</a>' +
        '</div>' +
        '<div ng-show="view.editorEnabled">' +
            '<input ng-model="view.editableValue">' +
            '<a ng-click="save()">Save</a>' +
            ' or ' +
            '<a ng-click="disableEditor()">cancel</a>.' +
        '</div>' +
    '</div>';

    return {
        restrict: "A",
        replace: true,
        template: editorTemplate,
        scope: {
            value: "=editable",
            callback: "&",
            property: "@editable"
        },
        controller: function($scope) {
            $scope.view = {
                editableValue: $scope.value,
                editorEnabled: false
            };

            $scope.enableEditor = function() {
                $scope.view.editorEnabled = true;
                $scope.view.editableValue = $scope.value;
            };

            $scope.disableEditor = function() {
                $scope.view.editorEnabled = false;
            };

            $scope.save = function(data) {
                $scope.value = $scope.view.editableValue;
                $scope.disableEditor();
                obj = {}
                obj[$scope.property] = $scope.value
                $scope.callback({data: obj});
            };
        }
    };
});
