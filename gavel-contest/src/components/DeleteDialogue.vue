<template>
    <popup-modal ref="popup">
        <h2 style="margin-top: 0">{{ title }}</h2>
        <p>{{ message }}</p>
        <div class="btns">
            <span class="ok-btn" @click="_confirm">{{ okButton }}</span>
            <button class="cancel-btn" @click="_cancel">{{ cancelButton }}</button>
        </div>
    </popup-modal>
</template>

<script>
import PopupModal from './PopupModal.vue'
import UserTeamDeletionService from "@/services/UserTeamDeletionService"
import router from "../router";

export default {
    name: 'DeleteDialogue',

    components: { PopupModal },

    data: () => ({
        // Parameters that change depending on the type of dialogue
        title: undefined,
        message: undefined, // Main text content
        okButton: undefined, // Text for confirm button; leave it empty because we don't know what we're using it for
        cancelButton: 'Go Back', // text for cancel button
        email: '',
        name: '',
        
        // Private variables
        resolvePromise: undefined,
        rejectPromise: undefined,
    }),

    methods: {
        show(opts = {}) {
            this.title = opts.title
            this.message = opts.message
            this.okButton = opts.okButton
            if (opts.cancelButton) {
                this.cancelButton = opts.cancelButton
            }
            this.email = opts.email,
            this.name = opts.name
            // Once we set our config, we tell the popup modal to open
            this.$refs.popup.open()
            // Return promise so the caller can get results
            return new Promise((resolve, reject) => {
                this.resolvePromise = resolve
                this.rejectPromise = reject
            })
        },

        async _confirm() {
           await UserTeamDeletionService.delete({email: this.email})
                .then(() => {
                    this.$refs.popup.close()
                    this.resolvePromise(true)
                    router.push("/teams")
                }).catch(error => {
                    this.$refs.popup.close()
                    this.rejectPromise(new Error(error.response.data.error))
                })            
        },

        _cancel() {
            this.$refs.popup.close()
            this.resolvePromise(false)
            // Or you can throw an error
            // this.rejectPromise(new Error('User cancelled the dialogue'))
        }
    }
}
</script>

<style scoped>
.btns {
    
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
    margin-right: 45%;
    font-family: 'Fira Sans';
}

.cancel-btn {
    padding: 0.5em 1em;
    background-color: #4BB052;
    color: #F2FFED;
    border: 0.1px solid #212529;
    border-radius: 5px;
    font-weight: bold;
    font-size: 16px;
    text-transform: uppercase;
    cursor: pointer;
    margin-top: 20px;
    font-family: 'Fira Sans';
}

.password {
  padding: 0.5em 1em;
  background-color: #ffffff;
  color: #212529;
  border: 0.1px solid #212529;
  border-radius: 5px;
  font-weight: bold;
  font-size: 16px;
  text-transform: uppercase;
  cursor: pointer;
}


</style>