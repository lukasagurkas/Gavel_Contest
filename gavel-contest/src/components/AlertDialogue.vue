<template>
    <popup-modal ref="popup">
        <h2 style="margin-top: 0">{{ title }}</h2>
        <p>{{ message }}</p>
        <div class="btns">
            <span class="ok-btn" @click="_confirm">{{ okButton }}</span>
        </div>
    </popup-modal>
</template>

<script>
import PopupModal from './PopupModal.vue'

export default {
    name: 'AlertDialogue',

    components: { PopupModal },

    data: () => ({
        // Parameters that change depending on the type of dialogue
        title: undefined,
        message: undefined, // Main text content
        okButton: undefined, // Text for confirm button; leave it empty because we don't know what we're using it for
        
        // Private variables
        resolvePromise: undefined,
    }),

    methods: {
        show(opts = {}) {
            this.title = opts.title
            this.message = opts.message
            this.okButton = opts.okButton
            // Once we set our config, we tell the popup modal to open
            this.$refs.popup.open()
            // Return promise so the caller can get results
            return new Promise(resolve => {
                this.resolvePromise = resolve
            })
        },

        _confirm() {
            this.$refs.popup.close()
            this.resolvePromise(true)
        },
    },
}
</script>

<style scoped>
.btns {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.ok-btn {
  padding: 0.5em 1em;
  background-color: #4BB052;
  color: #F2FFED;
  border: 0.1px solid #212529;
  border-radius: 5px;
  font-weight: bold;
  font-size: 16px;
  text-transform: uppercase;
  cursor: pointer;
  margin-left: 5px;
  font-family: 'Fira Sans';   
}
</style>