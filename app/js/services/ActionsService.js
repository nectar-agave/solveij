angular.module('AgaveToGo',[]).service('ActionsService',['$uibModal', '$rootScope', '$localStorage', '$location', '$state', '$stateParams', '$translate', 'AppsController', 'SystemsController', 'JobsController', 'NotificationsController', 'MetaController', 'MonitorsController', function($uibModal, $rootScope, $localStorage, $location, $state, $stateParams, $translate, AppsController, SystemsController, JobsController, NotificationsController, MetaController, MonitorsController){  this.getNotifications = function(resourceType, resource){    switch(resourceType){      case 'monitor':        $state.go('notifications-manager', {'associatedUuid': resource.id, 'resourceType': resourceType});        break;      default:        $state.go('notifications-manager', {'associatedUuid': resource.uuid, 'resourceType': resourceType});        break;    }  };  this.clone = function(resourceType, resource, resourceAction, resourceList, resourceIndex){    switch(resourceType){      case 'systems':        SystemsController.getSystemRole(resource.id, $localStorage.activeProfile.username)          .then(function(response){            if (response.result.role !== "NONE" && response.result.role !== 'GUEST'){              var modalInstance = $uibModal.open({              templateUrl: 'tpl/modals/ModalSystemsConfirmCloneAction.html',              scope: $rootScope,              resolve:{                  resource: function() {                    return resource;                  },                  resourceType: function() {                    return resourceType;                  },                  resourceAction: function() {                    return resourceAction;                  },                  resourceList: function(){                    return resourceList;                  },                  resourceIndex: function(){                    return resourceIndex;                  }              },              controller: ['$scope', '$modalInstance', 'resourceType', 'resource', 'resourceAction', 'resourceList', 'resourceIndex',                function($scope, $modalInstance, resourceType, resource, resourceAction, resourceList, resourceIndex ){                    $scope.resource = resource;                    $scope.resourceAction = resourceAction;                    $scope.schema = {                      "type": "object",                      "properties": {                        "id": {                          "type": "string",                          "description": "A new unique identifier you assign to the system. A system id must be globally unique across a tenant and cannot be reused once deleted",                          "title": "ID",                        }                      }                    };                    $scope.form = [                       {                         "key": "id",                         ngModelOptions: {                           updateOnDefault: true                         },                         $validators: {                            required: function(value) {                              return value ? true : false;                            }                          },                          validationMessage: {                            "required": "Missing required"                          }                        }                    ];                    $scope.model= {};                    $scope.cancel = function(){                        $modalInstance.dismiss('cancel');                    };                    $scope.submit = function(){                      $scope.requesting = true;                      $scope.error = '';                      if ($scope.myForm.$valid){                        var body = {'action': resourceAction, 'id': $scope.model.id};                        SystemsController.updateInvokeSystemAction(body, resource.id)                        .then(                          function(response){                            App.alert({message: "Successfully cloned " + resource.id});                            $modalInstance.dismiss();                            $scope.requesting = false;                            $state.transitionTo($state.current, $stateParams, {                              reload: true, inherit: false, notify: true                            });                          },                          function(response){                            var message = '';                            if (response.errorResponse){                              if (response.errorResponse.message) {                                message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.message                              } else if (response.errorResponse.fault){                                message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.fault.message;                              }                            } else {                              message = 'Error trying to ' + resourceAction + ' ' + resource.id;                            }                            $scope.error = message;                            $scope.requesting = false;                          });                      } else {                        var message = 'Invalid form';                        App.alert(                          {                            type: 'danger',                            message: message                          }                        );                        $scope.requesting = false;                      }                    }                  }]              });            } else {              App.alert({type: 'danger',message: 'Missing credentials to clone system'});            }          })          .catch(function(response) {            var message = '';            if (response.errorResponse){              if (response.errorResponse.message) {                message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.message              } else if (response.errorResponse.fault){                message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.fault.message;              }            } else {              message = 'Error trying to ' + resourceAction + ' ' + resource.id;            }            App.alert(              {                type: 'danger',                message: message              }            );          });          break;          case 'apps':            SystemsController.listSystems(99999)            .then(function(response){                var storageSystemsTitleMap = [];                var executionSystemsTitleMap = [];                _.each(response.result, function(system){                  if (system.type === 'STORAGE') {                    storageSystemsTitleMap.push({"value": system.id, "name": system.id});                  } else {                    executionSystemsTitleMap.push({"value": system.id, "name": system.id});                  }                });                var modalInstance = $uibModal.open({                templateUrl: 'tpl/modals/ModalAppsConfirmCloneAction.html',                scope: $rootScope,                resolve:{                    resource: function() {                      return resource;                    },                    resourceType: function() {                      return resourceType;                    },                    resourceAction: function() {                      return resourceAction;                    },                    resourceList: function(){                      return resourceList;                    },                    resourceIndex: function(){                      return resourceIndex;                    }                },                controller: ['$scope', '$modalInstance', 'resourceType', 'resource', 'resourceAction', 'resourceList', 'resourceIndex',                  function($scope, $modalInstance, resourceType, resource, resourceAction, resourceList, resourceIndex ){                      $scope.resource = resource;                      $scope.resourceAction = resourceAction;                      $scope.schema = {                        "type": "object",                        "properties": {                          "name": {                            "type": "string",                            "description": "Name given to the clone of the existing app. Defaults to the current app name and the authenticated user's username appended with a dash",                            "title": "Name",                          },
                          "version": {
                              "type": "string",
                              "description": "Version given to the clone of the existing app. Defaults to the current app's version number. It should be in #.#.# format",
                              "title": "Version",
                              "validator": "\\d+(\\.\\d+)+",
                              "minLength": 3,
                              "maxLength": 16
                          },
                          "deploymentSystem":{
                            "type": "string",
                            "description": "Deployment path for the application assets on the cloned app's storage system. This only applies to clone public apps.",
                            "title": "Deployment System",
                          },
                          "executionSystem":{
                            "type": "string",
                            "description": "Execution system for the new app. Defaults to the current app's execution system",
                            "title": "Execution System",
                          }
                        }                      };                      $scope.form = [                        {                          "key": "name",                        },                        {                          "key": "version",                        },                        {                          "key": "deploymentSystem",                          "type": "select",                          "titleMap": storageSystemsTitleMap                        },                        {                          "key": "executionSystem",                          "type": "select",                          "titleMap": executionSystemsTitleMap                        }                      ];                      $scope.model= {};                      $scope.cancel = function(){                          $modalInstance.dismiss('cancel');                      };                      $scope.submit = function(){                        $scope.requesting = true;                        $scope.error = '';                        if ($scope.myForm.$valid){                          var body = {'action': resourceAction};                          angular.extend(body, $scope.model);                          AppsController.updateInvokeAppAction(resource.id, body)                          .then(                            function(response){                              App.alert({message: "Successfully cloned " + resource.id});                              $modalInstance.dismiss();                              $scope.requesting = false;                              $state.transitionTo($state.current, $stateParams, {                                reload: true, inherit: false, notify: true                              });                            },                            function(response){                              var message = '';                              if (response.errorResponse){                                if (response.errorResponse.message) {                                  message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.message                                } else if (response.errorResponse.fault){                                  message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.fault.message;                                }                              } else {                                message = 'Error trying to ' + resourceAction + ' ' + resource.id;                              }                              $scope.error = message;                              $scope.requesting = false;                            });                        } else {                          var message = 'Invalid form';                          App.alert(                            {                              type: 'danger',                              message: message                            }                          );                          $scope.requesting = false;                        }                      }                    }]                });            })            .catch(function(response) {              var message = '';              if (response.errorResponse){                if (response.errorResponse.message) {                  message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.message                } else if (response.errorResponse.fault){                  message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.fault.message;                }              } else {                message = 'Error trying to ' + resourceAction + ' ' + resource.id;              }              App.alert(                {                  type: 'danger',                  message: message                }              );            });          break;    }  };  this.confirmAction = function(resourceType, resource, resourceAction, resourceList, resourceIndex){      var modalInstance = $uibModal.open({        templateUrl: 'tpl/modals/ModalConfirmResourceAction.html',        scope: $rootScope,        resolve:{            resource: function() {              return resource;            },            resourceType: function() {              return resourceType;            },            resourceAction: function() {              return resourceAction;            },            resourceList: function(){              return resourceList;            },            resourceIndex: function(){              return resourceIndex;            }        },        controller: ['$scope', '$modalInstance', 'resourceType', 'resource', 'resourceAction', 'resourceList', 'resourceIndex',          function($scope, $modalInstance, resourceType, resource, resourceAction, resourceList, resourceIndex ){            $scope.resourceType = resourceType;            $scope.resource = resource;            $scope.resourceAction = resourceAction;            $scope.resourceIndex = resourceIndex;            $scope.resourceList = resourceList;            $scope.ok = function(){              switch(resourceType){                case 'apps':                  switch(resourceAction){                    case 'enable':                    case 'disable':                    case 'publish':                    case 'unpublish':                      var body = {'action': resourceAction};                      AppsController.updateInvokeAppAction(resource.id, body)                        .then(                          function(response){                            $scope.resource = response.result;                            // temp fix until we get caching sorted out                            switch(resourceAction){                              case 'enable': $scope.resource.available = true;                                break;                              case 'disable': $scope.resource.available = false;                                break;                              case 'publish': $scope.resource.isPublic = true;                                break;                              case 'unpublish': $scope.resource.isPublic = false;                                break;                            }                            $modalInstance.dismiss();                          },                          function(response){                            var message = '';                            if (response.errorResponse.message) {                              message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.message                            } else if (response.errorResponse.fault){                              message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.fault.message;                            } else {                              message = 'Error trying to ' + resourceAction + ' ' + resource.id;                            }                            App.alert(                              {                                type: 'danger',                                message: message                              }                            );                            $modalInstance.dismiss();                          });                      break;                    case 'delete':                      AppsController.deleteApp(resource.id)                        .then(                          function(response){                            if (typeof resourceList === 'undefined' || resourceList === ''){                              $location.path('/apps');                            } else {                              $scope.resourceList.splice($scope.resourceList.indexOf($scope.resource), 1);                            }                            $modalInstance.dismiss();                          },                          function(response){                            var message = '';                            if (response.errorResponse.message) {                              message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.message                            } else if (response.errorResponse.fault){                              message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.fault.message;                            } else {                              message = 'Error trying to ' + resourceAction + ' ' + resource.id;                            }                            App.alert(                              {                                type: 'danger',                                message: message                              }                            );                            $modalInstance.dismiss();                          });                      break;                  }                  break;                case 'systems':                  switch(resourceAction){                    case 'enable':                    case 'disable':                    case 'publish':                    case 'unpublish':                    case 'setDefault':                    case 'unsetDefault':                      var body = {'action': resourceAction};                      SystemsController.updateInvokeSystemAction(body, resource.id)                        .then(                          function(response){                            resource = response.result;                            // temp fix until we get caching sorted out                            switch(resourceAction){                              case 'enable': $scope.resource.available = true;                                break;                              case 'disable': $scope.resource.available = false;                                break;                              case 'publish': $scope.resource.isSublic = true;                                break;                              case 'unpublish': $scope.resource.isPublic = false;                                break;                              case 'setDefault': $scope.resource.default = true;                                break;                              case 'unsetDefault': $scope.resource.default = false;                                break;                            }                            $modalInstance.dismiss();                          },                          function(response){                            var message = '';                            if (response.errorResponse.message) {                              message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.message                            } else if (response.errorResponse.fault){                              message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.fault.message;                            } else {                              message = 'Error trying to ' + resourceAction + ' ' + resource.id;                            }                            App.alert(                              {                                type: 'danger',                                message: message                              }                            );                            $modalInstance.dismiss();                          });                      break;                    case 'delete':                      SystemsController.deleteSystem(resource.id)                        .then(                          function(response){                            if (typeof resourceList === 'undefined' || resourceList === ''){                              $location.path('/systems');                            } else {                              $scope.resourceList.splice($scope.resourceList.indexOf($scope.resource), 1);                            }                            $modalInstance.dismiss();                          },                          function(response){                            var message = '';                            if (response.errorResponse.message) {                              message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.message                            } else if (response.errorResponse.fault){                              message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.fault.message;                            } else {                              message = 'Error trying to ' + resourceAction + ' ' + resource.id;                            }                            App.alert(                              {                                type: 'danger',                                message: message                              }                            );                            $modalInstance.dismiss();                          });                          break;                  }                  break;                  case 'jobs':                    switch(resourceAction){                      case 'delete':                        JobsController.deleteJob(resource.id)                          .then(                            function(response){                              if (typeof resourceList === 'undefined' || resourceList === ''){                                $location.path('/jobs');                              } else {                                $scope.resourceList.splice($scope.resourceList.indexOf($scope.resource), 1);                              }                              $modalInstance.dismiss();                            },                            function(response){                              var message = '';                              if (response.errorResponse.message) {                                message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.message                              } else if (response.errorResponse.fault){                                message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.fault.message;                              } else {                                message = 'Error trying to ' + resourceAction + ' ' + resource.id;                              }                              App.alert(                                {                                  type: 'danger',                                  message: message                                }                              );                              $modalInstance.dismiss();                            }                          );                        break;                        case 'stop':                          var body = {action: resourceAction};                          JobsController.createStopJob(body, resource.id)                            .then(                              function(response){                                resource.status = 'STOPPED';                                $modalInstance.dismiss();                              },                              function(response){                                var message = '';                                if (response.errorResponse.message) {                                  message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.message                                } else if (response.errorResponse.fault){                                  message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.fault.message;                                } else {                                  message = 'Error trying to ' + resourceAction + ' ' + resource.id;                                }                                App.alert(                                  {                                    type: 'danger',                                    message: message                                  }                                );                                $modalInstance.dismiss();                              }                            );                          break;                    }                  break;                  case 'notifications':                    switch(resourceAction){                      case 'delete':                      NotificationsController.deleteNotification(resource.id)                        .then(                          function(response){                            if (typeof resourceList === 'undefined' || resourceList === ''){                              $location.path('/notifications');                            } else {                              $scope.resourceList.splice($scope.resourceList.indexOf($scope.resource), 1);                            }                            $modalInstance.dismiss();                          },                          function(response){                            var message = '';                            if (response.errorResponse.message) {                              message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.message                            } else if (response.errorResponse.fault){                              message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.fault.message;                            } else {                              message = 'Error trying to ' + resourceAction + ' ' + resource.id;                            }                            App.alert(                              {                                type: 'danger',                                message: message                              }                            );                            $modalInstance.dismiss();                          }                        );                        break;                    }                    break;                    case 'meta':                      switch(resourceAction){                        case 'delete':                          MetaController.deleteMetadata(resource.id)                            .then(                              function(response){                                if (typeof resourceList === 'undefined' || resourceList === ''){                                  $location.path('/notifications/alerts');                                } else {                                  $scope.resourceList.splice($scope.resourceList.indexOf($scope.resource), 1);                                }                                $modalInstance.dismiss();                              },                              function(response){                                var message = '';                                if (response.errorResponse.message) {                                  message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.message                                } else if (response.errorResponse.fault){                                  message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.fault.message;                                } else {                                  message = 'Error trying to ' + resourceAction + ' ' + resource.id;                                }                                App.alert(                                  {                                    type: 'danger',                                    message: message                                  }                                );                              }                            );                          break;                      }                    break;                    case 'monitors':                      switch(resourceAction){                        case 'delete':                          MonitorsController.deleteMonitoringTask(resource.id)                            .then(                              function(response){                                if (typeof resourceList === 'undefined' || resourceList === ''){                                  $location.path('/monitors/manager');                                } else {                                  $scope.resourceList.splice($scope.resourceList.indexOf($scope.resource), 1);                                }                                $modalInstance.dismiss();                              },                              function(response){                                var message = '';                                if (response.errorResponse.message) {                                  message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.message                                } else if (response.errorResponse.fault){                                  message = 'Error trying to ' + resourceAction + ' ' + resource.id + ' - ' + response.errorResponse.fault.message;                                } else {                                  message = 'Error trying to ' + resourceAction + ' ' + resource.id;                                }                                App.alert(                                  {                                    type: 'danger',                                    message: message                                  }                                );                              }                            );                          break;                      }                    break;              }            };            $scope.cancel = function(){                $modalInstance.dismiss('cancel');            };        }]      });  };  this.edit = function(resourceType, resource){    switch(resourceType){      case 'apps': $state.go('apps-edit', {'appId': resource.id });        break;      case 'systems': $state.go('systems-edit', {'systemId': resource.id });        break;      case 'monitors':        $state.go('monitors-edit', {'monitorId': resource.id });        break;      case 'notifications':        $state.go('notifications-edit', {'notificationId': resource.id });        break;    }  };}]);