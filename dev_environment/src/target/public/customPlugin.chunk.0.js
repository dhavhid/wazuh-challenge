(window["customPlugin_bundle_jsonpfunction"] = window["customPlugin_bundle_jsonpfunction"] || []).push([[0],{

/***/ "./public/application.tsx":
/*!********************************!*\
  !*** ./public/application.tsx ***!
  \********************************/
/*! exports provided: renderApp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderApp", function() { return renderApp; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/app */ "./public/components/app.tsx");



const renderApp = ({
  notifications,
  http
}, {
  navigation
}, {
  appBasePath,
  element
}) => {
  react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_app__WEBPACK_IMPORTED_MODULE_2__["CustomPluginApp"], {
    basename: appBasePath,
    notifications: notifications,
    http: http,
    navigation: navigation
  }), element);
  return () => react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.unmountComponentAtNode(element);
};

/***/ }),

/***/ "./public/components/app.tsx":
/*!***********************************!*\
  !*** ./public/components/app.tsx ***!
  \***********************************/
/*! exports provided: CustomPluginApp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomPluginApp", function() { return CustomPluginApp; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _osd_i18n_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @osd/i18n/react */ "@osd/i18n/react");
/* harmony import */ var _osd_i18n_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_osd_i18n_react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../common */ "./common/index.ts");
/* harmony import */ var _services_todo_api__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/todo_api */ "./public/services/todo_api.ts");
/* harmony import */ var _todo_list__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./todo_list */ "./public/components/todo_list.tsx");
/* harmony import */ var _todo_form__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./todo_form */ "./public/components/todo_form.tsx");
/* harmony import */ var _todo_filters__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./todo_filters */ "./public/components/todo_filters.tsx");
/* harmony import */ var _todo_stats__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./todo_stats */ "./public/components/todo_stats.tsx");










const CustomPluginApp = ({
  basename,
  notifications,
  http,
  navigation
}) => {
  const todoApi = new _services_todo_api__WEBPACK_IMPORTED_MODULE_5__["TodoApi"](http);
  const [todos, setTodos] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]);
  const [total, setTotal] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(0);
  const [loading, setLoading] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);
  const [stats, setStats] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(null);
  const [availableTags, setAvailableTags] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]);
  const [searchQuery, setSearchQuery] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('');
  const [selectedStatuses, setSelectedStatuses] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]);
  const [selectedPriorities, setSelectedPriorities] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]);
  const [selectedTags, setSelectedTags] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])([]);
  const [pageIndex, setPageIndex] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(0);
  const [pageSize, setPageSize] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(10);
  const [sortField, setSortField] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('createdAt');
  const [sortDirection, setSortDirection] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('desc');
  const [isCreateModalVisible, setIsCreateModalVisible] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);
  const [editingTodo, setEditingTodo] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(null);
  const [deletingTodoId, setDeletingTodoId] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(null);
  const loadTodos = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(async () => {
    setLoading(true);
    try {
      const result = await todoApi.searchTodos({
        query: searchQuery || undefined,
        status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
        priority: selectedPriorities.length > 0 ? selectedPriorities : undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        from: pageIndex * pageSize,
        size: pageSize,
        sortField,
        sortOrder: sortDirection
      });
      setTodos(result.items);
      setTotal(result.total);
    } catch (error) {
      notifications.toasts.addDanger({
        title: 'Error loading tasks',
        // @ts-ignore
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedStatuses, selectedPriorities, selectedTags, pageIndex, pageSize, sortField, sortDirection]);
  const loadStats = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(async () => {
    try {
      const statsData = await todoApi.getStats();
      setStats(statsData);
    } catch (error) {
      notifications.toasts.addDanger({
        title: 'Error loading statistics',
        // @ts-ignore
        text: error.message
      });
    }
  }, []);
  const loadTags = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(async () => {
    try {
      const tags = await todoApi.getAllTags();
      setAvailableTags(tags);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  }, []);
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    loadTodos();
  }, [loadTodos]);
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    loadStats();
    loadTags();
  }, [loadStats, loadTags]);
  const handleCreateTodo = async data => {
    try {
      await todoApi.createTodo(data);
      notifications.toasts.addSuccess('Task created successfully');
      setIsCreateModalVisible(false);
      loadTodos();
      loadStats();
      loadTags();
    } catch (error) {
      notifications.toasts.addDanger({
        title: 'Error creating task',
        text: error.message
      });
    }
  };
  const handleUpdateTodo = async data => {
    if (!editingTodo) return;
    try {
      await todoApi.updateTodo(editingTodo.id, data);
      notifications.toasts.addSuccess('Task updated successfully');
      setEditingTodo(null);
      loadTodos();
      loadStats();
      loadTags();
    } catch (error) {
      notifications.toasts.addDanger({
        title: 'Error updating task',
        text: error.message
      });
    }
  };
  const handleDeleteTodo = async () => {
    if (!deletingTodoId) return;
    try {
      await todoApi.deleteTodo(deletingTodoId);
      notifications.toasts.addSuccess('Task deleted successfully');
      setDeletingTodoId(null);
      loadTodos();
      loadStats();
    } catch (error) {
      notifications.toasts.addDanger({
        title: 'Error deleting task',
        text: error.message
      });
    }
  };
  const handleStatusChange = async (id, status) => {
    try {
      await todoApi.updateTodo(id, {
        status
      });
      notifications.toasts.addSuccess('Task status updated');
      loadTodos();
      loadStats();
    } catch (error) {
      notifications.toasts.addDanger({
        title: 'Error updating status',
        text: error.message
      });
    }
  };
  const handleTableChange = criteria => {
    if (criteria.page) {
      setPageIndex(criteria.page.index);
      setPageSize(criteria.page.size);
    }
    if (criteria.sort) {
      setSortField(criteria.sort.field);
      setSortDirection(criteria.sort.direction);
    }
  };
  const handleSearchChange = query => {
    setSearchQuery(query);
    setPageIndex(0);
  };
  const handleStatusFilterChange = statuses => {
    setSelectedStatuses(statuses);
    setPageIndex(0);
  };
  const handlePriorityFilterChange = priorities => {
    setSelectedPriorities(priorities);
    setPageIndex(0);
  };
  const handleTagFilterChange = tags => {
    setSelectedTags(tags);
    setPageIndex(0);
  };
  const tabs = [{
    id: 'tasks',
    name: 'Tasks',
    content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_todo_filters__WEBPACK_IMPORTED_MODULE_8__["TodoFilters"], {
      searchQuery: searchQuery,
      selectedStatuses: selectedStatuses,
      selectedPriorities: selectedPriorities,
      selectedTags: selectedTags,
      availableTags: availableTags,
      onSearchChange: handleSearchChange,
      onStatusChange: handleStatusFilterChange,
      onPriorityChange: handlePriorityFilterChange,
      onTagChange: handleTagFilterChange
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_todo_list__WEBPACK_IMPORTED_MODULE_6__["TodoList"], {
      todos: todos,
      total: total,
      loading: loading,
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortField: sortField,
      sortDirection: sortDirection,
      onTableChange: handleTableChange,
      onEdit: setEditingTodo,
      onDelete: setDeletingTodoId,
      onStatusChange: handleStatusChange
    }))
  }, {
    id: 'stats',
    name: 'Statistics',
    content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiSpacer"], null), stats && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_todo_stats__WEBPACK_IMPORTED_MODULE_9__["TodoStatsComponent"], {
      stats: stats
    }))
  }];
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["BrowserRouter"], {
    basename: basename
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_osd_i18n_react__WEBPACK_IMPORTED_MODULE_1__["I18nProvider"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(navigation.ui.TopNavMenu, {
    appName: _common__WEBPACK_IMPORTED_MODULE_4__["PLUGIN_ID"],
    useDefaultBehaviors: true
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiPage"], {
    paddingSize: "l"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiPageBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiPageHeader"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiFlexGroup"], {
    justifyContent: "spaceBetween",
    alignItems: "center"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiFlexItem"], {
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiTitle"], {
    size: "l"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, _common__WEBPACK_IMPORTED_MODULE_4__["PLUGIN_NAME"]))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiFlexItem"], {
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiButton"], {
    fill: true,
    iconType: "plusInCircle",
    onClick: () => setIsCreateModalVisible(true)
  }, "Create Task")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiTabbedContent"], {
    tabs: tabs,
    initialSelectedTab: tabs[0]
  }))), isCreateModalVisible && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiModal"], {
    onClose: () => setIsCreateModalVisible(false)
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiModalHeader"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiModalHeaderTitle"], null, "Create New Task")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiModalBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_todo_form__WEBPACK_IMPORTED_MODULE_7__["TodoForm"], {
    availableTags: availableTags,
    onSubmit: handleCreateTodo,
    onCancel: () => setIsCreateModalVisible(false)
  }))), editingTodo && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiModal"], {
    onClose: () => setEditingTodo(null)
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiModalHeader"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiModalHeaderTitle"], null, "Edit Task")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiModalBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_todo_form__WEBPACK_IMPORTED_MODULE_7__["TodoForm"], {
    todo: editingTodo,
    availableTags: availableTags,
    onSubmit: handleUpdateTodo,
    onCancel: () => setEditingTodo(null)
  }))), deletingTodoId && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_3__["EuiConfirmModal"], {
    title: "Delete Task",
    onCancel: () => setDeletingTodoId(null),
    onConfirm: handleDeleteTodo,
    cancelButtonText: "Cancel",
    confirmButtonText: "Delete",
    buttonColor: "danger"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, "Are you sure you want to delete this task? This action cannot be undone.")))));
};

/***/ }),

/***/ "./public/components/todo_filters.tsx":
/*!********************************************!*\
  !*** ./public/components/todo_filters.tsx ***!
  \********************************************/
/*! exports provided: TodoFilters */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TodoFilters", function() { return TodoFilters; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common */ "./common/index.ts");



const statusOptions = [{
  value: _common__WEBPACK_IMPORTED_MODULE_2__["TodoStatus"].PLANNED,
  label: 'Planned'
}, {
  value: _common__WEBPACK_IMPORTED_MODULE_2__["TodoStatus"].IN_PROGRESS,
  label: 'In Progress'
}, {
  value: _common__WEBPACK_IMPORTED_MODULE_2__["TodoStatus"].COMPLETED,
  label: 'Completed'
}, {
  value: _common__WEBPACK_IMPORTED_MODULE_2__["TodoStatus"].COMPLETED_WITH_ERROR,
  label: 'Completed with Error'
}];
const priorityOptions = [{
  value: _common__WEBPACK_IMPORTED_MODULE_2__["TodoPriority"].LOW,
  label: 'Low'
}, {
  value: _common__WEBPACK_IMPORTED_MODULE_2__["TodoPriority"].MEDIUM,
  label: 'Medium'
}, {
  value: _common__WEBPACK_IMPORTED_MODULE_2__["TodoPriority"].HIGH,
  label: 'High'
}, {
  value: _common__WEBPACK_IMPORTED_MODULE_2__["TodoPriority"].CRITICAL,
  label: 'Critical'
}];
const TodoFilters = ({
  searchQuery,
  selectedStatuses,
  selectedPriorities,
  selectedTags,
  availableTags,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onTagChange
}) => {
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = react__WEBPACK_IMPORTED_MODULE_0___default.a.useState(false);
  const [isPriorityPopoverOpen, setIsPriorityPopoverOpen] = react__WEBPACK_IMPORTED_MODULE_0___default.a.useState(false);
  const [isTagPopoverOpen, setIsTagPopoverOpen] = react__WEBPACK_IMPORTED_MODULE_0___default.a.useState(false);
  const toggleStatus = status => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter(s => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };
  const togglePriority = priority => {
    if (selectedPriorities.includes(priority)) {
      onPriorityChange(selectedPriorities.filter(p => p !== priority));
    } else {
      onPriorityChange([...selectedPriorities, priority]);
    }
  };
  const toggleTag = tag => {
    if (selectedTags.includes(tag)) {
      onTagChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagChange([...selectedTags, tag]);
    }
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], {
    gutterSize: "m",
    responsive: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
    grow: true
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFieldSearch"], {
    placeholder: "Search tasks by title, description, tags, or assignee...",
    value: searchQuery,
    onChange: e => onSearchChange(e.target.value),
    isClearable: true,
    fullWidth: true
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], {
    size: "m"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFilterGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPopover"], {
    button: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFilterButton"], {
      iconType: "arrowDown",
      onClick: () => setIsStatusPopoverOpen(!isStatusPopoverOpen),
      isSelected: isStatusPopoverOpen,
      numFilters: statusOptions.length,
      hasActiveFilters: selectedStatuses.length > 0,
      numActiveFilters: selectedStatuses.length
    }, "Status"),
    isOpen: isStatusPopoverOpen,
    closePopover: () => setIsStatusPopoverOpen(false),
    panelPaddingSize: "none"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "euiFilterSelect__items"
  }, statusOptions.map(option => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFilterSelectItem"], {
    key: option.value,
    checked: selectedStatuses.includes(option.value) ? 'on' : undefined,
    onClick: () => toggleStatus(option.value)
  }, option.label)))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPopover"], {
    button: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFilterButton"], {
      iconType: "arrowDown",
      onClick: () => setIsPriorityPopoverOpen(!isPriorityPopoverOpen),
      isSelected: isPriorityPopoverOpen,
      numFilters: priorityOptions.length,
      hasActiveFilters: selectedPriorities.length > 0,
      numActiveFilters: selectedPriorities.length
    }, "Priority"),
    isOpen: isPriorityPopoverOpen,
    closePopover: () => setIsPriorityPopoverOpen(false),
    panelPaddingSize: "none"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "euiFilterSelect__items"
  }, priorityOptions.map(option => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFilterSelectItem"], {
    key: option.value,
    checked: selectedPriorities.includes(option.value) ? 'on' : undefined,
    onClick: () => togglePriority(option.value)
  }, option.label)))), availableTags.length > 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPopover"], {
    button: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFilterButton"], {
      iconType: "arrowDown",
      onClick: () => setIsTagPopoverOpen(!isTagPopoverOpen),
      isSelected: isTagPopoverOpen,
      numFilters: availableTags.length,
      hasActiveFilters: selectedTags.length > 0,
      numActiveFilters: selectedTags.length
    }, "Tags"),
    isOpen: isTagPopoverOpen,
    closePopover: () => setIsTagPopoverOpen(false),
    panelPaddingSize: "none"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: "euiFilterSelect__items"
  }, availableTags.map(tag => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFilterSelectItem"], {
    key: tag,
    checked: selectedTags.includes(tag) ? 'on' : undefined,
    onClick: () => toggleTag(tag)
  }, tag))))));
};

/***/ }),

/***/ "./public/components/todo_form.tsx":
/*!*****************************************!*\
  !*** ./public/components/todo_form.tsx ***!
  \*****************************************/
/*! exports provided: TodoForm */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TodoForm", function() { return TodoForm; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../common */ "./common/index.ts");




const statusOptions = [{
  value: _common__WEBPACK_IMPORTED_MODULE_3__["TodoStatus"].PLANNED,
  text: 'Planned'
}, {
  value: _common__WEBPACK_IMPORTED_MODULE_3__["TodoStatus"].IN_PROGRESS,
  text: 'In Progress'
}, {
  value: _common__WEBPACK_IMPORTED_MODULE_3__["TodoStatus"].COMPLETED,
  text: 'Completed'
}, {
  value: _common__WEBPACK_IMPORTED_MODULE_3__["TodoStatus"].COMPLETED_WITH_ERROR,
  text: 'Completed with Error'
}];
const priorityOptions = [{
  value: _common__WEBPACK_IMPORTED_MODULE_3__["TodoPriority"].LOW,
  text: 'Low'
}, {
  value: _common__WEBPACK_IMPORTED_MODULE_3__["TodoPriority"].MEDIUM,
  text: 'Medium'
}, {
  value: _common__WEBPACK_IMPORTED_MODULE_3__["TodoPriority"].HIGH,
  text: 'High'
}, {
  value: _common__WEBPACK_IMPORTED_MODULE_3__["TodoPriority"].CRITICAL,
  text: 'Critical'
}];
const TodoForm = ({
  todo,
  availableTags,
  onSubmit,
  onCancel
}) => {
  const [title, setTitle] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])((todo === null || todo === void 0 ? void 0 : todo.title) || '');
  const [description, setDescription] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])((todo === null || todo === void 0 ? void 0 : todo.description) || '');
  const [status, setStatus] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])((todo === null || todo === void 0 ? void 0 : todo.status) || _common__WEBPACK_IMPORTED_MODULE_3__["TodoStatus"].PLANNED);
  const [priority, setPriority] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])((todo === null || todo === void 0 ? void 0 : todo.priority) || _common__WEBPACK_IMPORTED_MODULE_3__["TodoPriority"].MEDIUM);
  const [assignee, setAssignee] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])((todo === null || todo === void 0 ? void 0 : todo.assignee) || '');
  const [dueDate, setDueDate] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(todo !== null && todo !== void 0 && todo.dueDate ? moment__WEBPACK_IMPORTED_MODULE_2___default()(todo.dueDate) : null);
  const [selectedTags, setSelectedTags] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])((todo === null || todo === void 0 ? void 0 : todo.tags.map(tag => ({
    label: tag
  }))) || []);
  const [errorMessage, setErrorMessage] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])((todo === null || todo === void 0 ? void 0 : todo.errorMessage) || '');
  const [errors, setErrors] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({});
  const tagOptions = availableTags.map(tag => ({
    label: tag
  }));
  const onCreateTag = (searchValue, flattenedOptions) => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();
    if (!normalizedSearchValue) {
      return;
    }
    const newOption = {
      label: searchValue
    };
    if (flattenedOptions.findIndex(option => option.label.trim().toLowerCase() === normalizedSearchValue) === -1) {
      setSelectedTags([...selectedTags, newOption]);
    }
  };
  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = ['Title is required'];
    }
    if (status === _common__WEBPACK_IMPORTED_MODULE_3__["TodoStatus"].COMPLETED_WITH_ERROR && !errorMessage.trim()) {
      newErrors.errorMessage = ['Error message is required for completed with error status'];
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = () => {
    if (!validate()) {
      return;
    }
    const data = {
      title,
      description: description || undefined,
      status,
      priority,
      tags: selectedTags.map(tag => tag.label),
      assignee: assignee || undefined,
      dueDate: dueDate ? dueDate.toISOString() : undefined
    };
    if (status === _common__WEBPACK_IMPORTED_MODULE_3__["TodoStatus"].COMPLETED_WITH_ERROR) {
      data.errorMessage = errorMessage;
    }
    onSubmit(data);
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiForm"], {
    component: "form"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
    label: "Title",
    isInvalid: !!errors.title,
    error: errors.title,
    fullWidth: true
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFieldText"], {
    placeholder: "Enter task title",
    value: title,
    onChange: e => setTitle(e.target.value),
    isInvalid: !!errors.title,
    fullWidth: true
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
    label: "Description",
    fullWidth: true
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTextArea"], {
    placeholder: "Enter task description",
    value: description,
    onChange: e => setDescription(e.target.value),
    rows: 3,
    fullWidth: true
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
    label: "Status",
    fullWidth: true
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSelect"], {
    options: statusOptions,
    value: status,
    onChange: e => setStatus(e.target.value),
    fullWidth: true
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
    label: "Priority",
    fullWidth: true
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSelect"], {
    options: priorityOptions,
    value: priority,
    onChange: e => setPriority(e.target.value),
    fullWidth: true
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
    label: "Tags",
    fullWidth: true
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiComboBox"], {
    placeholder: "Select or create tags",
    options: tagOptions,
    selectedOptions: selectedTags,
    onChange: setSelectedTags,
    onCreateOption: onCreateTag,
    isClearable: true,
    fullWidth: true
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
    label: "Assignee",
    fullWidth: true
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFieldText"], {
    placeholder: "Enter assignee name",
    value: assignee,
    onChange: e => setAssignee(e.target.value),
    fullWidth: true
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
    label: "Due Date",
    fullWidth: true
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiDatePicker"], {
    selected: dueDate,
    onChange: date => setDueDate(date),
    placeholder: "Select due date",
    fullWidth: true,
    popoverPlacement: "top-end"
  })))), status === _common__WEBPACK_IMPORTED_MODULE_3__["TodoStatus"].COMPLETED_WITH_ERROR && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFormRow"], {
    label: "Error Message",
    isInvalid: !!errors.errorMessage,
    error: errors.errorMessage,
    fullWidth: true
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTextArea"], {
    placeholder: "Describe the error",
    value: errorMessage,
    onChange: e => setErrorMessage(e.target.value),
    isInvalid: !!errors.errorMessage,
    rows: 2,
    fullWidth: true
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], {
    justifyContent: "flexEnd"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButtonEmpty"], {
    onClick: onCancel
  }, "Cancel")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButton"], {
    type: "submit",
    fill: true,
    onClick: handleSubmit
  }, todo ? 'Update' : 'Create'))));
};

/***/ }),

/***/ "./public/components/todo_list.tsx":
/*!*****************************************!*\
  !*** ./public/components/todo_list.tsx ***!
  \*****************************************/
/*! exports provided: TodoList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TodoList", function() { return TodoList; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../common */ "./common/index.ts");




const getStatusColor = status => {
  switch (status) {
    case _common__WEBPACK_IMPORTED_MODULE_3__["TodoStatus"].PLANNED:
      return 'default';
    case _common__WEBPACK_IMPORTED_MODULE_3__["TodoStatus"].IN_PROGRESS:
      return 'primary';
    case _common__WEBPACK_IMPORTED_MODULE_3__["TodoStatus"].COMPLETED:
      return 'success';
    case _common__WEBPACK_IMPORTED_MODULE_3__["TodoStatus"].COMPLETED_WITH_ERROR:
      return 'danger';
    default:
      return 'default';
  }
};
const getPriorityColor = priority => {
  switch (priority) {
    case _common__WEBPACK_IMPORTED_MODULE_3__["TodoPriority"].LOW:
      return '#6dccb1';
    case _common__WEBPACK_IMPORTED_MODULE_3__["TodoPriority"].MEDIUM:
      return '#54b399';
    case _common__WEBPACK_IMPORTED_MODULE_3__["TodoPriority"].HIGH:
      return '#f5a700';
    case _common__WEBPACK_IMPORTED_MODULE_3__["TodoPriority"].CRITICAL:
      return '#bd271e';
    default:
      return 'default';
  }
};
const TodoList = ({
  todos,
  total,
  loading,
  pageIndex,
  pageSize,
  sortField,
  sortDirection,
  onTableChange,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const columns = [{
    field: 'title',
    name: 'Title',
    sortable: true,
    truncateText: true,
    width: '20%',
    render: (title, item) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], {
      size: "s"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, title), item.description && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], {
      size: "xs",
      color: "subdued"
    }, item.description)))
  }, {
    field: 'status',
    name: 'Status',
    sortable: true,
    width: '130px',
    render: status => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiHealth"], {
      color: getStatusColor(status)
    }, status.replace(/_/g, ' ').toUpperCase())
  }, {
    field: 'priority',
    name: 'Priority',
    sortable: true,
    width: '100px',
    render: priority => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiBadge"], {
      color: getPriorityColor(priority)
    }, priority.toUpperCase())
  }, {
    field: 'tags',
    name: 'Tags',
    truncateText: true,
    width: '15%',
    render: tags => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], {
      wrap: true,
      responsive: false,
      gutterSize: "xs"
    }, tags.slice(0, 3).map(tag => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
      grow: false,
      key: tag
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiBadge"], {
      color: "hollow"
    }, tag))), tags.length > 3 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiBadge"], {
      color: "hollow"
    }, "+", tags.length - 3)))
  }, {
    field: 'assignee',
    name: 'Assignee',
    sortable: true,
    truncateText: true,
    width: '120px',
    render: assignee => assignee || '-'
  }, {
    field: 'dueDate',
    name: 'Due Date',
    sortable: true,
    width: '120px',
    render: dueDate => {
      if (!dueDate) return '-';
      const date = moment__WEBPACK_IMPORTED_MODULE_2___default()(dueDate);
      const isOverdue = date.isBefore(moment__WEBPACK_IMPORTED_MODULE_2___default()()) && date.isValid();
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], {
        size: "s",
        color: isOverdue ? 'danger' : 'default'
      }, date.format('MMM DD, YYYY'));
    }
  }, {
    field: 'createdAt',
    name: 'Created',
    sortable: true,
    width: '120px',
    render: createdAt => moment__WEBPACK_IMPORTED_MODULE_2___default()(createdAt).format('MMM DD, YYYY')
  }, {
    name: 'Actions',
    width: '180px',
    render: item => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], {
      gutterSize: "s",
      responsive: false,
      wrap: true
    }, item.status !== _common__WEBPACK_IMPORTED_MODULE_3__["TodoStatus"].COMPLETED && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiToolTip"], {
      content: "Mark as completed"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButtonIcon"], {
      iconType: "check",
      color: "success",
      "aria-label": "Complete",
      onClick: () => onStatusChange(item.id, _common__WEBPACK_IMPORTED_MODULE_3__["TodoStatus"].COMPLETED)
    }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiToolTip"], {
      content: "Edit"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButtonIcon"], {
      iconType: "pencil",
      color: "primary",
      "aria-label": "Edit",
      onClick: () => onEdit(item)
    }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiToolTip"], {
      content: "Delete"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButtonIcon"], {
      iconType: "trash",
      color: "danger",
      "aria-label": "Delete",
      onClick: () => onDelete(item.id)
    }))))
  }];
  const pagination = {
    pageIndex,
    pageSize,
    totalItemCount: total,
    pageSizeOptions: [10, 25, 50, 100]
  };
  const sorting = {
    sort: {
      field: sortField,
      direction: sortDirection
    }
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiBasicTable"], {
    items: todos,
    columns: columns,
    pagination: pagination,
    sorting: sorting,
    onChange: onTableChange,
    loading: loading,
    tableLayout: "auto"
  });
};

/***/ }),

/***/ "./public/components/todo_stats.tsx":
/*!******************************************!*\
  !*** ./public/components/todo_stats.tsx ***!
  \******************************************/
/*! exports provided: TodoStatsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TodoStatsComponent", function() { return TodoStatsComponent; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _elastic_charts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @elastic/charts */ "@elastic/charts");
/* harmony import */ var _elastic_charts__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_elastic_charts__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../common */ "./common/index.ts");




const customColors = {
  CRITICAL: '#bd271e',
  HIGH: '#f5a700',
  MEDIUM: '#54b399',
  LOW: '#98a2b3'
};
const TodoStatsComponent = ({
  stats
}) => {
  var _stats$byStatus$TodoS, _stats$byStatus$TodoS2;
  console.log(stats);
  const statusData = Object.entries(stats.byStatus).map(([key, value]) => ({
    status: key.replace(/_/g, ' ').toUpperCase(),
    count: value
  }));
  const priorityData = Object.entries(stats.byPriority).map(([key, value]) => ({
    priority: key.toUpperCase(),
    count: value,
    color: customColors[key.toUpperCase()] || '#000'
  }));
  const formatCompletionTime = milliseconds => {
    if (!milliseconds) return 'N/A';
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h`;
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPanel"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiStat"], {
    title: stats.total.toString(),
    description: "Total Tasks",
    titleColor: "primary",
    textAlign: "center"
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPanel"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiStat"], {
    title: ((_stats$byStatus$TodoS = stats.byStatus[_common__WEBPACK_IMPORTED_MODULE_3__["TodoStatus"].COMPLETED]) === null || _stats$byStatus$TodoS === void 0 ? void 0 : _stats$byStatus$TodoS.toString()) || '0',
    description: "Completed",
    titleColor: "success",
    textAlign: "center"
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPanel"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiStat"], {
    title: ((_stats$byStatus$TodoS2 = stats.byStatus[_common__WEBPACK_IMPORTED_MODULE_3__["TodoStatus"].IN_PROGRESS]) === null || _stats$byStatus$TodoS2 === void 0 ? void 0 : _stats$byStatus$TodoS2.toString()) || '0',
    description: "In Progress",
    titleColor: "primary",
    textAlign: "center"
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPanel"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiStat"], {
    title: `${stats.completionRate.toFixed(1)}%`,
    description: "Completion Rate",
    titleColor: "accent",
    textAlign: "center"
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPanel"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiStat"], {
    title: formatCompletionTime(stats.avgCompletionTime),
    description: "Avg. Completion Time",
    titleColor: "subdued",
    textAlign: "center"
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPanel"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], {
    size: "xs"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, "Tasks by Status")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], {
    size: "m"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    style: {
      height: 300
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_2__["Chart"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_2__["Settings"], {
    showLegend: true,
    legendPosition: "right"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_2__["Partition"], {
    id: "status-partition",
    data: statusData,
    valueAccessor: d => d.count,
    layers: [{
      groupByRollup: d => d.status,
      shape: {
        fillColor: d => {
          const status = d === null || d === void 0 ? void 0 : d.dataName;
          if (status !== null && status !== void 0 && status.includes('COMPLETED') && !(status !== null && status !== void 0 && status.includes('ERROR'))) return '#6dccb1';
          if (status !== null && status !== void 0 && status.includes('PROGRESS')) return '#006bb4';
          if (status !== null && status !== void 0 && status.includes('ERROR')) return '#bd271e';
          return '#98a2b3';
        }
      }
    }],
    config: {
      partitionLayout: _elastic_charts__WEBPACK_IMPORTED_MODULE_2__["PartitionLayout"].sunburst,
      emptySizeRatio: 0.4
    }
  }))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiPanel"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiTitle"], {
    size: "xs"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, "Tasks by Priority")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], {
    size: "m"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    style: {
      height: 300
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_2__["Chart"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_2__["Settings"], {
    showLegend: false
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_2__["BarSeries"], {
    id: "priority-bar",
    name: "Tasks",
    data: priorityData,
    xAccessor: "priority",
    yAccessors: ['count'],
    styleAccessor: d => {
      var _d$datum;
      return (_d$datum = d.datum) === null || _d$datum === void 0 ? void 0 : _d$datum.color;
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_2__["Axis"], {
    id: "bottom-axis",
    position: "bottom",
    gridLine: {
      visible: true
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_elastic_charts__WEBPACK_IMPORTED_MODULE_2__["Axis"], {
    id: "left-axis",
    position: "left",
    gridLine: {
      visible: true
    }
  })))))));
};

/***/ }),

/***/ "./public/services/todo_api.ts":
/*!*************************************!*\
  !*** ./public/services/todo_api.ts ***!
  \*************************************/
/*! exports provided: TodoApi */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TodoApi", function() { return TodoApi; });
class TodoApi {
  constructor(http) {
    this.http = http;
  }
  async createTodo(data) {
    return await this.http.post('/api/custom_plugin/todos', {
      body: JSON.stringify(data)
    });
  }
  async getTodo(id) {
    return await this.http.get(`/api/custom_plugin/todos/${id}`);
  }
  async updateTodo(id, data) {
    return await this.http.put(`/api/custom_plugin/todos/${id}`, {
      body: JSON.stringify(data)
    });
  }
  async deleteTodo(id) {
    return await this.http.delete(`/api/custom_plugin/todos/${id}`);
  }
  async searchTodos(params) {
    return await this.http.post('/api/custom_plugin/todos/_search', {
      body: JSON.stringify(params)
    });
  }
  async getStats() {
    return await this.http.get('/api/custom_plugin/todos/_stats');
  }
  async getAllTags() {
    const response = await this.http.get('/api/custom_plugin/todos/_tags');
    return response.tags;
  }
}

/***/ })

}]);
//# sourceMappingURL=customPlugin.chunk.0.js.map