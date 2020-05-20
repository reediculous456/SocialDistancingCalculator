<template>
  <table
    v-once
    ref="table"
    :class="className"
    cellpadding="0"
  >
    <thead>
      <tr>
        <th
          v-for="(field, i) in options.columns"
          :key="i"
          :class="field.className"
        >
          {{ field.title }}
        </th>
      </tr>
    </thead>
  </table>
</template>

<script>
import 'datatables.net';
import 'datatables.net-responsive';
import 'datatables.net-bs4';
import 'datatables.net-responsive-bs4';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-buttons-bs4';

export default {
  name: `datatable`,
  props: {
    className: {
      type: String,
      default: `table table-striped`,
    },
    /**
     * the options object: https://datatables.net/manual/options
     *
     * @type Object
     */
    opts: { type: Object, default() { return {}; } },
    fields: { type: Array, default: null },
  },
  data() {
    return {
      options: {
        columns: [],
        language: {
          infoFiltered: ``,
        },
        scrollY: 700,
        lengthMenu: [[ 10, 25, 50, 100, -1 ], [ 10, 25, 50, 100, `All` ]],
        paging: false,
        pageLength: 25,
        buttons: [],
        order: [[ 0, `asc` ]],
      },
      dataTable: null,
    };
  },
  created() {
    const orders = [];
    let icol = 0;

    if (this.opts) {
      this.options = $.extend({}, this.options, this.opts);
    }

    if (this.options.buttons.length) {
      // eslint-disable-next-line max-len
      this.options.dom = `<'row'<'col-sm-12 col-md-6'l B><'col-sm-12 col-md-6'f>>` + `<'row'<'col-sm-12'tr>>` + `<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>`;
    }

    if (this.fields) {
      const { fields } = this;
      const cols = this.options.columns;
      for (const k in fields) {
        const field = fields[k];
        field.name = field.name || k;

        if (field.isLocal) {
          field.searchable = false;
          field.sortable = false;
        }

        const col = {
          title: field.label || field.name,
          width: field.width,
          data: field.data || field.name,
          name: field.name,
          className: field.className,
        };
        if (field.width) {
          col.width = field.width;
        }
        if (Object.hasOwnProperty.call(field, `defaultContent`)) {
          col.defaultContent = field.defaultContent;
        }
        if (Object.hasOwnProperty.call(field, `sortable`)) {
          col.orderable = field.sortable;
        }
        if (Object.hasOwnProperty.call(field, `visible`)) {
          col.visible = field.visible;
        }
        if (Object.hasOwnProperty.call(field, `searchable`)) {
          col.searchable = field.searchable;
        }
        if (field.template) {
          field.render = this.compileTemplate(field.template);
        }
        if (field.render) {
          col.render = field.render;
        }

        cols.push(col);
        if (field.defaultOrder) {
          orders.push([ icol, field.defaultOrder ]);
        }
        icol += 1;
      }
    }

    this.options.order = orders.length ? orders : this.options.order;
  },
  mounted() {
    const $el = $(this.$refs.table);
    this.dataTable = $el.DataTable(this.options);

    $el.on(`click`, `[data-action]`, (e) => {
      const target = $(e.target);
      const action = target.attr(`data-action`);
      if (action) {
        let tr = target.closest(`tr`);
        if (tr) {
          if (tr.attr(`role`) !== `row`) {
            tr = tr.prev();
          }
          const row = this.dataTable.row(tr);
          const data = row.data();
          this.$emit(action, data);
        } else {
          this.$emit(action);
        }
      }
    });

    $el.on(`change`, `[data-change]`, (e) => {
      const target = $(e.target);
      const action = target.attr(`data-change`);
      if (action) {
        let tr = target.closest(`tr`);
        if (tr) {
          if (tr.attr(`role`) !== `row`) {
            tr = tr.prev();
          }
          const row = this.dataTable.row(tr);
          const data = row.data();
          const selected = $(target).val();
          this.$emit(action, data, selected);
        } else {
          this.$emit(action);
        }
      }
    });
  },
  beforeDestroy() {
    if (this.dataTable) {
      this.dataTable.destroy(true);
    }
    this.dataTable = null;
  },
  methods: {
    reload(resetPaging = false) {
      this.dataTable.ajax.reload(data => { this.$emit(`reloaded`, data, this); }, resetPaging);
      return this;
    },
    search(value) {
      this.dataTable.search(value).draw();
      return this;
    },
    setTableData(data) {
      if (data.constructor === Array) {
        this.dataTable.clear().rows.add(data);
        this.dataTable.draw(false);
        this.dataTable.columns.adjust();
      }
      return this;
    },
    setColumnName(colId, newName) {
      $(this.dataTable.column(colId).header()).html(newName);
    },
    setPageLength(value) {
      this.dataTable.page.len(value);
      return this.reload();
    },
    getServerParams() {
      return this.dataTable.ajax.params();
    },
  },
};
</script>

<style lang="scss">
  @import '~datatables.net-bs4/css/dataTables.bootstrap4.min.css';
  @import '~datatables.net-buttons-bs4/css/buttons.bootstrap4.min.css';
</style>
