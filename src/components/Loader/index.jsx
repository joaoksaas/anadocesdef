export default function Loader({ carregando }) {
        return (
            <> 
                <div className={`text-brandMarrom flex flex-col items-center justify-center top-0 left-0 w-full h-full duration-200 ease-in-alt z-[600] bg-brandMarromFundo ${carregando? 'opacity-100' : 'pointer-events-none opacity-0'} fixed`}>
                    <img src="https://blog.roberthallam.org/wp-content/uploads/2022/09/loading-win98-transparent.gif" alt="gif" />
                    <h1 className="text-[3rem]">
                        Carregando
                    </h1>
                    <div className="flex flex-col items-center justify-center gap-[2rem] py-10">
                    </div>
                </div>
            </>
        );
}
