import type { PropertyTableEntry, PropertyTableEntryLeaf, PropertyTableEntryNode } from '@piveau/sdk-vue'
import type { PropType, VNode, VNodeArrayChildren } from 'vue'
import { isVNodeEmpty } from '@piveau/sdk-vue'
import { defineComponent, h, toRef } from 'vue'
import Typography from '../base/typography/Typography.vue'

const PropertyTable = defineComponent({
  name: 'PropertyTable',
  props: {
    as: { type: [Object, String], default: 'div' },
    root: { type: Boolean, default: false },
    node: { type: Object as PropType<PropertyTableEntryNode>, required: true },
  },
  setup(props, { slots }) {
    const node = toRef(props, 'node')

    function renderLeaf(data: PropertyTableEntryLeaf): VNode {
      if (data.type === 'value')
        return h('span', { class: 'break-words' }, data.data)

      if (data.type === 'href')
        return h('span', { class: 'break-words' }, h('a', { class: 'text-primary hover:text-primary-hover hover:underline break-words', href: data.data.href }, data.data.label))

      return h('span', { class: 'break-words' }, JSON.stringify(data))
    }

    function renderNodes(nodes: PropertyTableEntry[], depth: number = 0): VNodeArrayChildren {
      return nodes.map((data, idx) => {
        const itemSlot = slots.item
        if (itemSlot && !isVNodeEmpty(itemSlot?.({ data, idx, depth })))
          return itemSlot?.({ data, idx, depth })

        if (data.type === 'node' && depth <= 0) {
          const isLink = data.id === 'landingPage' || /link/i.test(String(data.label || ''))
          return !!data.data && data.data.length > 0
            ? h('tr', { class: ['flex min-w-0 flex-col gap-1 mb-2 mt-2', isLink ? 'md:col-span-2' : ''] }, [
                h('td', { class: 'block min-w-0 font-medium break-words' }, h(Typography, { as: 'span', variant: 'caption' }, () => data.label || data.id)),
                h('td', { class: 'block min-w-0' }, renderNodes(data.data || [], depth + 1)),
              ])
            : null
          // return h('tr', [
          //   slots.title?.({ title: data.label, depth }) || h('div', { class: 'font-medium' }, `${data.type} -> ${data.id} (${data.id}) (${data.data?.length || 0} children)`),
          //   !isVNodeEmpty(itemsSlot) ? itemsSlot : h('div', { class: 'pl-8' }, renderNodes(data.data || [], depth + 1)),
          // ])
        }

        if (data.type === 'node' && depth > 0) {
          // render only td without title
          return renderNodes(data.data || [], depth + 1)
        }

        if (data.type === 'value' || data.type === 'href')
          return h('td', { class: 'block min-w-0' }, renderLeaf(data))

        return null
      })
    }

    return () => h('table', {
      class: 'grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mb-2 w-full',
    }, renderNodes(node.value?.data || []))
  },
})

export { PropertyTable }
