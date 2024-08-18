import {Dialog,DialogContent} from "./ui/dialog"

const CommentDiscription = ({open, setOpen}) => {
  return (
    <Dialog open={open} >
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <img
          className=""
          src="https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=294&dpr=2&h=294&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXRodW1ibmFpbHx8NDUxfHxlbnwwfHx8fHw%3D"
          alt="Focused Content"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CommentDiscription
