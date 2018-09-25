import Controller from '@ember/controller';
import EmberObject, { computed } from '@ember/object';

const leveObject = EmberObject.extend({
});

export default Controller.extend({

    dragFinishText: false,
    dragStartedText: false,
    dragEndedText: false,

    areaArray: [
        { id: "1", name: "区域A" },
        { id: "2", name: "区域B" },
        { id: "3", name: "区域C" },
        { id: "4", name: "区域D" },
        { id: "5", name: "区域E" },
        { id: "6", name: "区域F" }
    ],

    levelArray: [
        leveObject.create({ id: "1", name: "1", selected: null }),
        leveObject.create({ id: "2", name: "2", selected: null }),
        leveObject.create({ id: "3", name: "3", selected: null }),
        leveObject.create({ id: "4", name: "4", selected: null }),
        leveObject.create({ id: "5", name: "5", selected: null }),
        leveObject.create({ id: "6", name: "6", selected: null })
    ],

    computeLevelArray: computed('levelArray.[]', function() {
        return this.get('levelArray')
    }),

    init() {
        this._super(...arguments)
    },
    actions: {
        dragResult(obj, ops) {
            this.get('levelArray').forEach(elem => {
                if (elem.get('id') === ops.target.leveid) {
                    if (ops.target.amount === "1" && elem.get('selected') === null) {
                        elem.set('selected', obj)
                        this.get('areaArray').removeObject(obj);
                    }
                }
            })
        },
        remove(targetId) {
            this.get('levelArray').forEach(elem => {
                if (elem.get('id') === targetId) {
                    this.get('areaArray').pushObject(elem.get('selected'));
                    elem.set('selected', null);
                }
            })
        }
        // dragStart: function () {
        //     this.set('dragEndedText', false);
        //     this.set('dragStartedText', 'Drag Has Started');
        // },
        // dragEnd: function () {
        //     this.set('dragStartedText', false);
        //     this.set('dragEndedText', 'Drag Has Ended');
        // },
        // draggingOverTarget: function () {
        //     console.log('Over target');
        // },
        // leftDragTarget: function () {
        //     console.log('Off target');
        // }

    }
});