// Some IMGUI type code

do_thing()
{
    PushDiv();
    
    Text("Hello");
    
    PopDiv();
}

// You can do this trick with a for loop hidden in a macro to turn that dual call site into a sigle call site
// Essentially, the initializer runs first, then the code in the body of the for loop runs, and then the iterator runs.
// So we stuff the PushDiv in the initializer using a comma, put the code for elements we want to push inside of this div
// in the code block and finally run PopDiv() at the end when the iterator runs.
#define Div() for(int SECRET_INTERNAL_I = 0, PushDiv(), SECRET_INTERNAL_I < 1; SECRET_INTERNAL_I++, PopDiv())

// Streamlined API
// Now we dont run the risk of accidentally misaligning our Push/Pop or forgetting a Pop!
do_thing()
{
    Div()
    {
        Text("Hello");
    }
}
